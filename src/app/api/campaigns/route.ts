import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: Request) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => cookieStore }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { name, description, price, max_supply, mint_price, contract_address } = await req.json();

  const { error } = await supabaseAdmin.from('campaigns').insert([{
    name,
    description,
    price,
    max_supply,
    mint_price,
    created_by: user.id,
    contract_address
  }]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

