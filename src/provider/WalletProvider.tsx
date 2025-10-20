'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { ConnectKitProvider } from 'connectkit';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { mantle } from 'viem/chains';
import '@rainbow-me/rainbowkit/styles.css';

const config = createConfig({
  chains: [mantle],
  transports: {
    [mantle.id]: http(),
  },
  connectors: [
    injected(),
    walletConnect({ projectId: '066465a4f5d400c9eccad76612f98c5a' }),
    coinbaseWallet({ appName: 'MonksCasting' }),
  ],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#deccaf',
            accentColorForeground: 'black',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          initialChain={mantle}
        >
          <ConnectKitProvider>{children}</ConnectKitProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
