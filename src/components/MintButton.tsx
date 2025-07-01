'use client';

import { useState } from 'react';
import { parseEther } from 'viem';
import { contractAddress, contractABI } from '@/lib/contractConfig';
import { walletClient } from '@/lib/wagmiClient';
import { simulateContract, writeContract } from '@wagmi/core';
import { config } from '@/lib/wagmiClient';

export default function MintButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const ticketTypeId = 0; // hardkodirano za test

  const mint = async () => {
    try {
      setLoading(true);
      setStatus(null);

      const client = await walletClient;
      const account = (await client?.getAddresses())?.[0] as `0x${string}`;
      if (!account) throw new Error('No wallet address found');

      const etherValue = parseEther('0.1');

      const { request } = await simulateContract(config, {
        address: contractAddress,
        abi: contractABI,
        functionName: 'mint',
        args: [BigInt(ticketTypeId)],
        account,
        value: etherValue,
      });

      const txHash = await writeContract(config, request);
      setStatus(`✅ Transaction sent! Hash: ${txHash}`);
    } catch (error: any) {
      console.error('❌ Mint failed:', error);
      setStatus(`❌ Error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={mint}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? 'Minting...' : 'Mint NFT'}
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}

