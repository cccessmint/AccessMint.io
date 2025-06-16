// src/lib/upsertUser.ts
import { supabase } from './supabase'

export async function upsertUser(walletAddress: string) {
  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        wallet_address: walletAddress,
        last_login: new Date().toISOString(),
      },
      {
        onConflict: 'wallet_address', // based on unique constraint
      }
    )
    .select()

  if (error) {
    console.error('Error upserting user:', error.message)
  }

  return data
}

