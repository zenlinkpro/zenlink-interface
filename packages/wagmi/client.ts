import { otherChains } from '@zenlink-interface/wagmi-config'
import type { Chain, CreateClientConfig } from 'wagmi'
import { allChains, configureChains, createClient } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from 'wagmi/providers/public'

export type Client = ReturnType<typeof createClient>

const { chains, provider }: CreateClientConfig & { chains: Chain[] } = configureChains(
  [...allChains, ...otherChains] as Chain[],
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
