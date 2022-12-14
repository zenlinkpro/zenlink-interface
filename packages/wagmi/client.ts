import { otherChains } from '@zenlink-interface/wagmi-config'
import type { Chain, CreateClientConfig } from 'wagmi'
import { configureChains, createClient } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { SubWalletConnector, TalismanConnector } from './connectors'

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
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'zenlink-interface',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new TalismanConnector({
      chains,
    }),
    new SubWalletConnector({
      chains,
    }),
  ],
})
