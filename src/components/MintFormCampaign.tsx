'use client';

import { useMintFromCampaign } from '@/hooks/useMintFromCampaign';
import rawABI from '@/lib/abis/AccessMintDynamicMulti.json';
import { contractAddress } from '@/lib/contractConfig';
import { Abi } from 'viem';

const contractABI = rawABI as Abi;

type Props = {
  mintPrice: string;
};

export default function MintFormCampaign({ mintPrice }: Props) {
  const parsedPrice = parseInt(mintPrice, 10);

  const { mint, isPending, isSuccess, error } = useMintFromCampaign(
    parsedPrice,
    contractAddress,
    contractABI,
    'mintFromCampaign'
  );

  return (
    <div className="p-4 border rounded mt-6">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={mint}
        disabled={isPending}
      >
        {isPending ? 'Minting...' : 'Mint from Campaign'}
      </button>
      {isSuccess && <p className="text-green-600 mt-2">Mint successful!</p>}
      {error && <p className="text-red-600 mt-2">{error.message}</p>}
    </div>
  );
}

