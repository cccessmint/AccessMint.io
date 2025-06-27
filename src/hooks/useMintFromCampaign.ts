import { useState } from 'react';
import {
  writeContract,
  simulateContract,
} from '@wagmi/core';
import { Abi, Address } from 'viem';
import { config } from '@/lib/wagmiClient';

export function useMintFromCampaign(
  mintPrice: number,
  contractAddress: Address,
  contractAbi: Abi,
  functionName: string
) {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function mint() {
    setIsPending(true);
    setIsSuccess(false);
    setError(null);

    try {
      const { request } = await simulateContract(config, {
        address: contractAddress,
        abi: contractAbi,
        functionName,
        args: [],
        value: BigInt(mintPrice),
      });

      const hash = await writeContract(config, request);
      console.log('Transaction hash:', hash);
      setIsSuccess(true);
    } catch (err) {
      console.error('Minting error:', err);
      setError(err as Error);
    } finally {
      setIsPending(false);
    }
  }

  return { mint, isPending, isSuccess, error };
}

