'use client'

import { createClient } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { z } from 'zod'

const MintSchema = z.object({
  id: z.string(),
  campaign_id: z.string(),
  wallet_address: z.string(),
  created_at: z.string(),
})

type Mint = z.infer<typeof MintSchema>

export default function AnalyticsPage() {
  const [mints, setMints] = useState<Mint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMints = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from('mints').select('*')

      if (error) {
        console.error('Greška pri dohvaćanju mintova:', error)
        return
      }

      const valid = MintSchema.array().safeParse(data)
      if (valid.success) {
        setMints(valid.data)
      } else {
        console.warn('Nevaljani mintovi:', valid.error)
      }

      setLoading(false)
    }

    fetchMints()
  }, [])

  if (loading) return <p>Učitavanje...</p>

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Pregled mintova</h1>
      <ul className="space-y-2">
        {mints.map((mint) => (
          <li key={mint.id} className="border p-2 rounded">
            <p>Kampanja: {mint.campaign_id}</p>
            <p>Wallet: {mint.wallet_address}</p>
            <p>Kreirano: {new Date(mint.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

