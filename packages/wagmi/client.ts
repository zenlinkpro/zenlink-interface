import { otherChains } from '@zenlink-interface/wagmi-config'
import type { Chain, CreateClientConfig } from 'wagmi'
import { configureChains, createClient } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

export type Client = ReturnType<typeof createClient>

const { chains, provider }: CreateClientConfig & { chains: Chain[] } = configureChains(
  [mainnet, ...otherChains] as Chain[],
  [publicProvider({ priority: 2 })],
  { pollingInterval: 8_000 },
)

export const client: Client = createClient({
  provider,
  logger: {
    warn: null,
  },
  autoConnect: false,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
  ],
})
