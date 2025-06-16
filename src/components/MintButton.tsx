'use client';

import { useState } from 'react';
import { useAccount, useContractWrite, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ACCESS_PASS_ABI, ACCESS_PASS_ADDRESS } from '@/lib/contractConfig';

interface Props {
  mintPrice: number;
}

export default function MintButton({ mintPrice }: Props) {
  const { address, isConnected } = useAccount();
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

  const { data, writeContract } = useContractWrite();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMint = async () => {
    const tx = await writeContract({
      address: ACCESS_PASS_ADDRESS,
      abi: ACCESS_PASS_ABI,
      functionName: 'mint',
      value: parseEther(mintPrice.toString()),
    });
    setHash(tx.hash);
  };

  if (!isConnected) {
    return <p>Please connect your wallet.</p>;
  }

  return (
    <div>
      <button
        onClick={handleMint}
        disabled={isConfirming}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isConfirming ? 'Minting...' : 'Mint Access Pass'}
      </button>

      {isConfirmed && (
        <div className="mt-4 p-2 bg-green-300 text-green-800 rounded">
          Successfully minted!
        </div>
      )}
    </div>
  );
}

