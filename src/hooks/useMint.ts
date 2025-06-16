'use client';

import { useWriteContract, useSimulateContract } from 'wagmi';
import { ACCESS_PASS_ADDRESS, ACCESS_PASS_ABI } from '@/lib/contractConfig';

export function useMint(price: bigint) {
  const { data: simData, error: simError } = useSimulateContract({
    address: ACCESS_PASS_ADDRESS,
    abi: ACCESS_PASS_ABI,
    functionName: 'mint',
    value: price,
  });

  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  function mint() {
    if (simError) {
      console.error(simError);
      return;
    }
    writeContract(simData?.request);
  }

  return { mint, isPending, isSuccess, error };
}

