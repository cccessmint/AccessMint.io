import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { cookies } from 'next/headers';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: Request) {
  const cookieStore = cookies();

  const supabase = createPagesServerClient({ cookies: () => cookieStore });

  const {
    name,
    description,
    mint_price,
    base_uri,
  } = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { data, error } = await supabaseAdmin.from('campaigns').insert([
    {
      user_id: user.id,
      name,
      description,
      mint_price,
      base_uri,
    },
  ]);

  if (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

