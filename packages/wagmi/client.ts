import { otherChains } from '@zenlink-interface/wagmi-config'
import type { Chain, CreateClientConfig } from 'wagmi'
import { configureChains, createClient } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

export type Client = ReturnType<typeof createClient>

const { chains, provider, webSocketProvider }: CreateClientConfig & { chains: Chain[] } = configureChains(
  [mainnet, ...otherChains] as Chain[],
  [publicProvider({ priority: 2 })],
  { pollingInterval: 8_000 },
)

export const client: Client = createClient({
  provider,
  webSocketProvider,
  logger: {
    warn: null,
  },
  autoConnect: false,
  connectors: [
    // TODO: more connectors
    // 1. Talisman connector (https://github.com/TalismanSociety/talisman-connectors/pull/7)
    // 2. Subwallet connector (waiting for upgraded to latest wagmi)
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
  ],
})
