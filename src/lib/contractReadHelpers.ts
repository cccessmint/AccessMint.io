import { wagmiConfig } from '@/lib/wagmiClient';
import { readContract } from 'viem';
import { ACCESS_PASS_ADDRESS, ACCESS_PASS_ABI } from '@/lib/contractConfig';

export async function getTotalSupply(): Promise<number> {
  const result = await readContract(wagmiConfig, {
    address: ACCESS_PASS_ADDRESS,
    abi: [
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'totalSupply',
  });

  return Number(result);
}

