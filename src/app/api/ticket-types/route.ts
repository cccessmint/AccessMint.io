import { uploadMetadataToIPFS } from '@/lib/pinataUpload';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import { addTicketTypeOnChain } from '@/lib/accessMintMultiContract';

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { campaign_id, type_name, price, max_supply, image_url } = await req.json();

  if (!campaign_id || !type_name || !price || !max_supply || !image_url) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  const metadata = {
    name: type_name,
    description: `${type_name} Ticket`,
    image: image_url,
    attributes: [
      { trait_type: 'Price', value: `${price} MATIC` },
      { trait_type: 'Max Supply', value: max_supply }
    ]
  };

  const ipfsUri = await uploadMetadataToIPFS(metadata);

  const txHash = await addTicketTypeOnChain({
    typeName: type_name,
    price: parseFloat(price),
    maxSupply: parseInt(max_supply),
    metadataURI: ipfsUri
  });

  const { error } = await supabaseAdmin.from('ticket_types').insert([
    {
      campaign_id,
      type_name,
      price: parseFloat(price),
      max_supply: parseInt(max_supply),
      metadata_uri: ipfsUri
    }
  ]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, txHash }), { status: 200 });
}

