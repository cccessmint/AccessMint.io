'use client';

import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { saveWalletAddress } from '@/lib/saveWallet';
import MintButton from '@/components/MintButton';

export default function WalletLoginPage() {
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const saveAddress = async () => {
      if (address && isConnected) {
        try {
          console.debug('[DEBUG] Trying to save address:', address);
          const result = await saveWalletAddress(address);
          if (result) {
            console.log('[SUCCESS] Wallet address saved:', address);
            setStatus('✅ Adresa spremljena u bazu.');
          }
        } catch (err) {
          console.error('[ERROR] Failed to save address:', err);
          setStatus('❌ Greška pri spremanju adrese.');
        }
      }
    };

    saveAddress();
  }, [address, isConnected]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center">Poveži novčanik</h1>
        <div className="flex justify-center my-4">
          <MintButton />
        </div>
        <p className="text-center">{status}</p>
      </div>
    </main>
  );
}

