import { createClient } from '@supabase/supabase-js';
import { contractAddress } from '@/lib/contractConfig';
import AccessMintDynamicMultiAbi from '@/lib/abis/AccessMintDynamicMulti.json';
import { createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request, { params }: { params: { tokenId: string } }) {
  const { tokenId } = params;

  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });

  const totalSupply = await publicClient.readContract({
    address: contractAddress,
    abi: AccessMintDynamicMultiAbi,
    functionName: 'totalSupply',
  });

  const tokenUri = await supabase
    .from('nft_metadata')
    .select('metadata_url')
    .eq('token_id', tokenId)
    .single();

  if (!tokenUri.data) {
    return new Response('Metadata not found', { status: 404 });
  }

  return Response.json({
    tokenId,
    metadata: tokenUri.data.metadata_url,
    totalSupply: (totalSupply as bigint).toString(),
  });
}

