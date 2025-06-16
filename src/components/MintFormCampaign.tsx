'use client';

import { useMintFromCampaign } from '@/hooks/useMintFromCampaign';

interface Props {
  mintPrice: number;
}

export default function MintFromCampaign({ mintPrice }: Props) {
  const { mint, isPending, isSuccess, error } = useMintFromCampaign(mintPrice);

  return (
    <div className="p-4 border rounded mt-6">
      <button
        onClick={mint}
        disabled={isPending}
        className="bg-blue-600 text-white p-2 rounded w-full"
      >
        {isPending ? 'Minting...' : 'Mint NFT'}
      </button>

      {isSuccess && <p className="mt-2 text-green-600">✅ Mint successful!</p>}
      {error && <p className="mt-2 text-red-600">{error.message}</p>}
    </div>
  );
}

