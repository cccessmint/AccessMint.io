export async function saveWalletAddress(address: string) {
  const response = await fetch('/api/save-wallet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallet_address: address }),
  })

  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error || 'Unknown error')
  }

  return await response.json()
}

