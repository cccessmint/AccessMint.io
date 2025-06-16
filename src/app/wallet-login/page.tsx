'use client'

import { MintButton } from '@/components/MintButton'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { saveWalletAddress } from '@/lib/saveWallet'

export default function WalletLoginPage() {
  const { address, isConnected } = useAccount()

  useEffect(() => {
    if (isConnected && address) {
      console.log('[DEBUG] Trying to save address:', address)
      saveWalletAddress(address)
        .then(() => console.log('[SUCCESS] Wallet address saved:', address))
        .catch((error) => console.error('[ERROR] Saving address failed:', error))
    }
  }, [isConnected, address])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-8">Connect Wallet and Mint</h1>
      <MintButton />
    </main>
  )
}

