import { http } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { createConfig } from '@wagmi/core'
import { createPublicClient, createWalletClient, custom } from 'viem'

export const config = createConfig({
  chains: [polygon],
  transports: {
    [polygon.id]: http(),
  },
})

export const publicClient = createPublicClient({
  chain: polygon,
  transport: http(),
})

export const walletClient = typeof window !== 'undefined' && window.ethereum
  ? createWalletClient({
      chain: polygon,
      transport: custom(window.ethereum),
    })
  : undefined

