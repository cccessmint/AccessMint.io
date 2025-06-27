'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function saveWalletAddress(address: string) {
  const supabase = createServerComponentClient({ cookies });
  const user = await supabase.auth.getUser();
  if (!user.data.user) return;

  await supabase
    .from('wallets')
    .upsert({ user_id: user.data.user.id, wallet_address: address });
}

