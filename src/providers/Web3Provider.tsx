'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { PropsWithChildren, useEffect, useState } from 'react';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

console.log('[DEBUG] WalletConnect Project ID:', projectId);

export function Web3Provider({ children }: PropsWithChildren) {
  const [config, setConfig] = useState<any>(null);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (typeof window !== 'undefined' && projectId) {
      const cfg = getDefaultConfig({
        appName: 'AccessMint',
        projectId,
        chains: [polygon],
        ssr: false, // isključi SSR podršku
      });
      setConfig(cfg);
    }
  }, []);

  if (!config) return null; // render nothing on server

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

