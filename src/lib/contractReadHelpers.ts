import { config } from '@/lib/wagmiClient';
import { readContract } from '@wagmi/core';
import { contractAddress, contractABI } from '@/lib/contractConfig';

export async function getTotalSupply(): Promise<number> {
  const result = await readContract(config, {
    address: contractAddress,
    abi: contractABI,
    functionName: 'totalSupply',
  });

  return Number(result);
}

