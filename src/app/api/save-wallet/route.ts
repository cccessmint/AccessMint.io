import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // koristi .env.local
)

export async function POST(req: NextRequest) {
  const { wallet_address } = await req.json()
  console.log('[DEBUG] BODY WALLET_ADDRESS:', wallet_address)

  if (!wallet_address) {
    return NextResponse.json({ error: 'Missing wallet_address' }, { status: 400 })
  }

  const { error } = await supabase
    .from('users')
    .upsert({ wallet_address }, { onConflict: 'wallet_address' })

  if (error) {
    console.error('[SUPABASE ERROR]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

