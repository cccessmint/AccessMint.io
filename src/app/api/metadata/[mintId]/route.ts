import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: Request, { params }: { params: { mintId: string } }) {
  const { mintId } = params;

  // Dohvatimo mint podatke s joinom na kampanju
  const { data: mint, error } = await supabaseAdmin
    .from('mints')
    .select('id, campaigns ( name, description )')
    .eq('id', mintId)
    .single();

  if (error || !mint) {
    return new Response('Mint not found', { status: 404 });
  }

  // Generiramo JSON metadata za NFT
  const metadata = {
    name: `AccessMint NFT - ${mint.campaigns?.[0]?.name}`,
    description: mint.campaigns?.[0]?.description,
    image: 'https://your-default-image-or-ipfs.jpg',
    attributes: [
      {
        trait_type: 'Mint ID',
        value: mint.id,
      },
    ],
  };

  return new Response(JSON.stringify(metadata), {
    headers: { 'Content-Type': 'application/json' },
  });
}

