import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { campaign_id, wallet_address, transaction_hash, token_uri } = await req.json();

  if (!campaign_id || !wallet_address || !transaction_hash || !token_uri) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from('mints').insert([
    {
      campaign_id,
      wallet_address,
      transaction_hash,
      token_uri,
      created_by: user.id, // OVDJE JE KLJUČNA DODANA LINIJA
    },
  ]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, mint: data }), { status: 200 });
}

