import {
  useAccount,
  useContractWrite,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { parseEther } from 'viem'
import { contractABI, contractAddress } from '@/lib/contractConfig'

export function useMint(mintPrice: number) {
  const { address, isConnected } = useAccount()

  const {
    data: hash,
    isPending,
    error,
    writeContract,
  } = useContractWrite()

  async function mint() {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected')
    }

    writeContract({
      abi: contractABI,
      address: contractAddress,
      functionName: 'mint',
      value: parseEther(mintPrice.toString()),
    })
  }

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    mint,
    isPending,
    isSuccess,
    error,
  }
}

