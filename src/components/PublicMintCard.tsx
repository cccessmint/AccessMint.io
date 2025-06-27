'use client';

import { useEffect, useState } from 'react';
import { useMintFromCampaign } from '@/hooks/useMintFromCampaign';
import { getTotalSupply } from '@/lib/contractReadHelpers';
import { contractAddress } from '@/lib/contractConfig';
import rawABI from '@/lib/abis/AccessMintDynamicMulti.json';
import { Abi } from 'viem';
const contractABI = rawABI as Abi;

export default function PublicMintCard({ campaign }: { campaign: any }) {
  const [totalSupply, setTotalSupply] = useState<number | null>(null);

  const parsedPrice = Number(campaign.mint_price);

const { mint, isPending, isSuccess, error } = useMintFromCampaign(
  parsedPrice,
  contractAddress,
  contractABI,
  'mintFromCampaign'
);

  useEffect(() => {
    fetchTotalSupply();
  }, []);

  const fetchTotalSupply = async () => {
    const supply = await getTotalSupply();
    setTotalSupply(supply);
  };

  const remaining = campaign.max_supply - (totalSupply ?? 0);
  const soldOut = remaining <= 0;

  return (
    <div className="border rounded p-4 shadow bg-white">
      <h2 className="text-xl font-semibold mb-2">{campaign.name}</h2>
      <p className="mb-2">{campaign.description}</p>
      <p className="mb-2">Mint Price: {campaign.mint_price} MATIC</p>
      {totalSupply !== null && (
        <p className="mb-2">
          Minted: {totalSupply} / {campaign.max_supply}
        </p>
      )}

      <button
        onClick={mint}
        disabled={isPending || soldOut}
        className={`p-2 rounded w-full ${soldOut ? 'bg-gray-400' : 'bg-blue-600 text-white'}`}
      >
        {soldOut ? 'Sold Out' : isPending ? 'Minting...' : 'Mint NFT'}
      </button>

      {isSuccess && <p className="mt-2 text-green-600">✅ Mint successful!</p>}
      {error && <p className="mt-2 text-red-600">❌ {error.message}</p>}
    </div>
  );
}

