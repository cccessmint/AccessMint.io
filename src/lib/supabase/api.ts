import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ✨ Upis mint transakcije u tablicu 'mints'
export async function saveMint({
  wallet,
  campaign_id,
  token_id,
  uri,
  tx,
}: {
  wallet: string;
  campaign_id: string;
  token_id: number;
  uri: string;
  tx: string;
}) {
  const { error } = await supabase.from('mints').insert({
    wallet,
    campaign_id,
    token_id,
    uri,
    tx,
  });

  if (error) {
    console.error("❌ Greška pri upisu mint transakcije:", error);
    throw new Error("Failed to save mint transaction.");
  }
}

