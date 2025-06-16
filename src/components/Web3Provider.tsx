'use client'

import {
  WagmiProvider,
  createConfig,
  http,
  createStorage,
  cookieStorage,
} from 'wagmi'
import { polygon } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
const queryClient = new QueryClient()

const config = getDefaultConfig({
  appName: 'AccessMint',
  projectId: '7e08938930a1778a5c21d0d31a6117d4',
  chains: [polygon],
  ssr: true,
  metadata: {
    name: 'AccessMint',
    description: 'Mintanje ulaznica putem blockchaina',
    url: 'http://localhost:3000',
    icons: ['http://localhost:3000/favicon.ico']
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
})


export default function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={config.chains}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

