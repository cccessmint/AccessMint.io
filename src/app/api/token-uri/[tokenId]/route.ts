import { createClient } from '@supabase/supabase-js';
import { ACCESS_MINT_DYNAMIC_MULTI_ADDRESS } from '@/lib/contractConfig';
import AccessMintDynamicMultiAbi from '@/lib/abis/AccessMintDynamicMulti.json';
import { createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const publicClient = createPublicClient({
  chain: polygon,
  transport: http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL!)
});

export async function GET(req: Request, { params }: { params: { tokenId: string } }) {
  const tokenId = parseInt(params.tokenId);

  if (!tokenId) {
    return new Response(JSON.stringify({ error: 'Invalid tokenId' }), { status: 400 });
  }

  // Dohvaćamo ukupni broj mintanih tokena:
  const totalSupply = await publicClient.readContract({
    address: ACCESS_MINT_DYNAMIC_MULTI_ADDRESS,
    abi: AccessMintDynamicMultiAbi,
    functionName: 'totalSupply',
  });

  if (tokenId > Number(totalSupply)) {
    return new Response(JSON.stringify({ error: 'Token does not exist' }), { status: 404 });
  }

  // Određujemo koji je ticketType na temelju tokenId-a
  // (jednostavna distribucija — svaki novi mint ide na ticketType redom)
  const ticketTypeId = tokenId; // ovdje pojednostavljeno mapiranje

  const { data, error } = await supabase
    .from('ticket_types')
    .select('*')
    .order('created_at', { ascending: true });

  if (error || !data || ticketTypeId > data.length) {
    return new Response(JSON.stringify({ error: 'Metadata not found' }), { status: 404 });
  }

  const ticketType = data[ticketTypeId - 1];

  const metadata = {
    name: `${ticketType.type_name} Ticket #${tokenId}`,
    description: `AccessMint Ticket for ${ticketType.type_name}`,
    image: ticketType.metadata_uri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
    attributes: [
      { trait_type: 'Ticket Type', value: ticketType.type_name },
      { trait_type: 'Price', value: `${ticketType.price} MATIC` },
      { trait_type: 'Max Supply', value: ticketType.max_supply }
    ]
  };

  return new Response(JSON.stringify(metadata), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}

