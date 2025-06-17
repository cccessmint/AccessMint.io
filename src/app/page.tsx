'use client'

import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { saveWalletAddress } from '@/lib/saveWallet'
import MintButton from '@/components/MintButton'

export default function WalletLoginPage() {
  const { address, isConnected } = useAccount()
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    const saveAddress = async () => {
      if (address && isConnected) {
        try {
          console.debug('[DEBUG] Trying to save address:', address)
          const result = await saveWalletAddress(address)
          if (result) {
            console.log('[SUCCESS] Wallet address saved:', address)
            setStatus('✅ Adresa spremljena u bazu.')
          }
        } catch (err) {
          console.error('[ERROR] Failed to save address:', err)
          setStatus('❌ Greška pri spremanju adrese.')
        }
      }
    }

    saveAddress()
  }, [address, isConnected])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Poveži novčanik</h1>
        <div className="flex justify-center mb-4">
          <ConnectButton />
        </div>
        {isConnected && (
          <>
            <p className="text-sm text-center text-gray-600 mb-2">Adresa: {address}</p>
            <p className="text-center text-green-600">{status}</p>
            <MintButton />
          </>
        )}
      </div>
    </main>
  )
}

