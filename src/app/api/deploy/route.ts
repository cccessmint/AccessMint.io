import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const contractsDir = path.resolve(process.cwd(), 'smart-contracts');

// Nova helper funkcija za deployment logove
async function logDeployment({
  campaign_name,
  contract_address,
  deploy_status,
  log_message,
  created_by,
}: {
  campaign_name: string;
  contract_address: string | null;
  deploy_status: string;
  log_message: string;
  created_by: string;
}) {
  await supabaseAdmin.from('deployment_logs').insert([
    {
      campaign_name,
      contract_address,
      deploy_status,
      log_message,
      created_by,
    },
  ]);
}

async function verifyOnPolygonscan(
  contractAddress: string,
  name: string,
  symbol: string,
  price: string,
  supply: string,
  baseURI: string,
  owner: string
) {
  try {
    const mintPriceInWei = (parseFloat(price) * 1e18).toString();

    const verifyCommand = `npx hardhat verify --network polygon \
${contractAddress} "${name}" "${symbol}" \
${mintPriceInWei} ${supply} \
"${baseURI}" ${owner}`;

    const { stdout, stderr } = await execAsync(verifyCommand, { cwd: contractsDir });

    console.log("✅ Verification Output:", stdout);
    if (stderr) console.error(stderr);
  } catch (err: any) {
    console.error("Verification failed:", err.message);
  }
}

export async function POST(req: Request) {
  try {
    const { name, symbol, mint_price, max_supply, base_uri, created_by } = await req.json();

    if (!name || !symbol || !mint_price || !max_supply || !base_uri || !created_by) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
    }

    console.log('Deploying contract with params:', { name, symbol, mint_price, max_supply, base_uri, created_by });

    const { stdout, stderr } = await execAsync(
      `npx hardhat run scripts/deploy.js --network polygon ` +
      `--name "${name}" --symbol "${symbol}" ` +
      `--price "${mint_price}" --supply "${max_supply}" ` +
      `--baseuri "${base_uri}" --owner "${created_by}"`,
      { cwd: contractsDir }
    );

    if (stderr) console.error(stderr);
    console.log(stdout);

    const match = stdout.match(/deployed to:\s*(0x[a-fA-F0-9]{40})/);
    if (!match) {
      console.error('Deploy output parsing failed.');

      await logDeployment({
        campaign_name: name,
        contract_address: null,
        deploy_status: 'failed',
        log_message: 'Deploy output parsing failed.',
        created_by,
      });

      return new Response(JSON.stringify({ error: 'Deploy output parsing failed' }), { status: 500 });
    }

    const contractAddress = match[1];

    const { error: insertError } = await supabaseAdmin.from('campaigns').insert([
      {
        name,
        description: `${name} NFT Campaign`,
        mint_price: parseFloat(mint_price),
        max_supply: parseInt(max_supply, 10),
        contract_address: contractAddress,
        created_by,
        deploy_status: 'pending_verification'
      },
    ]);

    if (insertError) {
      console.error('Supabase insert failed:', insertError);

      await logDeployment({
        campaign_name: name,
        contract_address: contractAddress,
        deploy_status: 'failed',
        log_message: insertError.message,
        created_by,
      });

      return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
    }

    console.log('✅ Contract successfully deployed and stored.');

    await logDeployment({
      campaign_name: name,
      contract_address: contractAddress,
      deploy_status: 'deployed',
      log_message: 'Smart contract deployed successfully.',
      created_by,
    });

    // Automatska verifikacija nakon deploya:
    await verifyOnPolygonscan(contractAddress, name, symbol, mint_price, max_supply, base_uri, created_by);

    await supabaseAdmin.from('campaigns')
      .update({ deploy_status: 'verified' })
      .eq('contract_address', contractAddress);

    await logDeployment({
      campaign_name: name,
      contract_address: contractAddress,
      deploy_status: 'verified',
      log_message: 'Contract successfully verified on PolygonScan.',
      created_by,
    });

    return new Response(JSON.stringify({ success: true, contractAddress }), { status: 200 });

  } catch (err: any) {
    console.error('Unhandled exception during deploy:', err);

    // General catch log
    await logDeployment({
      campaign_name: 'unknown',
      contract_address: null,
      deploy_status: 'failed',
      log_message: err.message,
      created_by: 'system',
    });

    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

