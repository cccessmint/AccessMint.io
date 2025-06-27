'use client'

import { useEffect, useState } from 'react'

type Props = {
  wallet: string
  campaign: string
}

export default function TicketPreview({ wallet, campaign }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const url = `/api/ticket?wallet=${wallet}&campaign=${encodeURIComponent(campaign)}`
    setImageUrl(url)
  }, [wallet, campaign])

  const handleDownload = () => {
    if (!imageUrl) return
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `access-pass-${campaign}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!imageUrl) return <p>Loading ticket preview...</p>

  return (
    <div className="border p-4 rounded shadow bg-white w-fit">
      <h2 className="text-lg font-semibold mb-2">🎟️ Ticket Preview</h2>
      <img src={imageUrl} alt="Access Pass Ticket" className="w-[300px] border" />
      <button
        onClick={handleDownload}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download PNG
      </button>
    </div>
  )
}

