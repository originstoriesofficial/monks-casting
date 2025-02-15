'use client'

import { WagmiProvider, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from "connectkit";
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { mantleSepoliaTestnet } from 'viem/chains';


export const config = getDefaultConfig({
    appName: 'MonksCasting',
    projectId: '066465a4f5d400c9eccad76612f98c5a', 
    chains: [mantleSepoliaTestnet],
    transports: {

        [mantleSepoliaTestnet.id]: http(),
    }
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={darkTheme({
                    accentColor: "#deccaf",
                    accentColorForeground: "black",
                    borderRadius: "medium",
                    fontStack: "system",
                    overlayBlur: "small",
                })} initialChain={mantleSepoliaTestnet}>
                    <ConnectKitProvider>{children}</ConnectKitProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
} 