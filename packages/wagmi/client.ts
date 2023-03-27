import { otherChains } from '@zenlink-interface/wagmi-config'
import type { Chain, CreateClientConfig } from 'wagmi'
import { configureChains, createClient } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { SafeConnector } from 'wagmi/connectors/safe'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { SubWalletConnector, TalismanConnector } from './connectors'

export type Client = ReturnType<typeof createClient>

const { chains, provider, webSocketProvider }: CreateClientConfig & { chains: Chain[] } = configureChains(
  [mainnet, ...otherChains] as Chain[],
  [publicProvider({ priority: 1 })],
)

export const client: Client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  logger: {
    warn: null,
  },
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
        projectId: '2d54460dfe49ac687751d282d0c54590',
      },
    }),
    new TalismanConnector({ chains }),
    new SubWalletConnector({ chains }),
    new SafeConnector({ chains }),
    new LedgerConnector({ chains }),
  ],
})
