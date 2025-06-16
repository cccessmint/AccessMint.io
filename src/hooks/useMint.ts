import { useState } from 'react';
import { useAccount, useContractWrite, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ACCESS_PASS_ABI, ACCESS_PASS_ADDRESS } from '@/lib/contractConfig';

export function useMint(mintPrice: number) {
  const { address, isConnected } = useAccount();
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

  const { data, writeContract } = useContractWrite();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const mint = async () => {
    const tx = await writeContract({
      address: ACCESS_PASS_ADDRESS,
      abi: ACCESS_PASS_ABI,
      functionName: 'mint',
      value: parseEther(mintPrice.toString()),
    });
    setHash(tx.hash);
  };

  return {
    address,
    isConnected,
    mint,
    isConfirming,
    isConfirmed,
  };
}

