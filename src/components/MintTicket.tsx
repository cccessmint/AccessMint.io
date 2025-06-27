'use client';

import { useEffect, useState } from 'react';
import { contractAddress, contractABI } from '@/lib/contractConfig';
import { publicClient } from '@/lib/wagmiClient';

export default function MintTicket({ mintPrice }: { mintPrice: string }) {
  const [maxSupply, setMaxSupply] = useState<bigint | null>(null);
  const [minted, setMinted] = useState<bigint | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!publicClient) return;

      try {
        const max = await publicClient.readContract({
          address: contractAddress,
          abi: contractABI,
          functionName: 'maxSupply',
        });

        const mintedCount = await publicClient.readContract({
          address: contractAddress,
          abi: contractABI,
          functionName: 'totalSupply',
        });

        setMaxSupply(max as bigint);
        setMinted(mintedCount as bigint);
      } catch (error) {
        console.error('Greška pri dohvaćanju podataka o mintanju:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 border rounded bg-white shadow-md">
      <p className="text-lg">Cijena: {mintPrice} MATIC</p>
      {maxSupply !== null && minted !== null && (
        <p className="text-sm text-gray-600">
          Mintano {minted.toString()} / {maxSupply.toString()}
        </p>
      )}
    </div>
  );
}

