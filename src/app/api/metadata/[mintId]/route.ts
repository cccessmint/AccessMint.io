import { supabaseAdmin } from '@/lib/supabaseAdmin';

interface Params {
  params: { mintId: string };
}

export async function GET(request: Request, { params }: Params) {
  const { mintId } = params;

  const { data: mint, error } = await supabaseAdmin
    .from('mints')
    .select('id, minted_at, wallet_address, campaigns(name, description)')
    .eq('id', mintId)
    .single();

  if (error || !mint) {
    return new Response(JSON.stringify({ error: 'Metadata not found' }), { status: 404 });
  }

  // Generiramo JSON metadata za NFT
  const metadata = {
    name: `AccessMint NFT - ${mint.campaigns?.name}`,
    description: mint.campaigns?.description,
    image: 'https://your-default-image-or-ipfs.jpg',
    attributes: [
      { trait_type: 'Campaign', value: mint.campaigns?.name },
      { trait_type: 'Minted At', value: mint.minted_at },
      { trait_type: 'Owner', value: mint.wallet_address }
    ]
  };

  return new Response(JSON.stringify(metadata), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

