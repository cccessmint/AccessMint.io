'use client';

import { useState, useEffect } from 'react';
import { readContract } from 'viem';
import { wagmiConfig } from '@/lib/wagmiClient';
import { ACCESS_PASS_ADDRESS, ACCESS_PASS_ABI } from '@/lib/contractConfig';
import { useMint } from '@/hooks/useMint';

export default function MintButton() {
  const [price, setPrice] = useState<bigint | null>(null);

  useEffect(() => {
    async function fetchMintPrice() {
      const result = await readContract(wagmiConfig, {
        address: ACCESS_PASS_ADDRESS,
        abi: ACCESS_PASS_ABI,
        functionName: 'mintPrice'
      });
      setPrice(result as bigint);
    }
    fetchMintPrice();
  }, []);

  const { mint, isPending, isSuccess, error } = useMint(price ?? 0n);

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl mb-4">Mint AccessPass</h2>

      {price && (
        <p className="mb-2">Price: {Number(price) / 1e18} MATIC</p>
      )}

      <button
        onClick={mint}
        disabled={isPending || price === null}
        className="bg-blue-600 text-white p-2 rounded w-full"
      >
        {isPending ? 'Minting...' : 'Mint NFT'}
      </button>

      {isSuccess && <p className="mt-2 text-green-600">✅ Mint successful!</p>}
      {error && <p className="mt-2 text-red-600">{error.message}</p>}
    </div>
  );
}

