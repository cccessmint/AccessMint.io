import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  const { mint_id, token_id } = await req.json();

  const { error } = await supabaseAdmin
    .from('mints')
    .update({ token_id })
    .eq('id', mint_id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

