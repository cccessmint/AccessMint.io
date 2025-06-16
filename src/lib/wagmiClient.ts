import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon } from 'wagmi/chains';
import { createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

export const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: 'AccessMint Portal',
    chains: [polygon],
    transports: {
      [polygon.id]: jsonRpcProvider({
        rpc: () => ({ http: 'https://polygon-rpc.com' }),
      }),
    },
  })
);

