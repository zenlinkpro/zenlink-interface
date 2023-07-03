// import { otherChains } from '@zenlink-interface/wagmi-config'
import type { Chain } from 'wagmi'
import { configureChains, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
// import { SafeConnector } from 'wagmi/connectors/safe'
// import { LedgerConnector } from 'wagmi/connectors/ledger'
// import { InjectedConnector } from '@wagmi/core'
// import { SubWalletConnector, TalismanConnector } from './connectors'

// const { chains, publicClient, webSocketPublicClient } = configureChains(
//   [mainnet, ...otherChains] as Chain[],
//   [publicProvider()],
//   {
//     batch: {
//       multicall: {
//         batchSize: 1024 * 10,
//       },
//     },
//   },
// )

const { publicClient } = configureChains(
  [mainnet] as Chain[],
  [publicProvider()],
  {
    batch: {
      multicall: {
        batchSize: 1024 * 10,
      },
    },
  },
)

export const config = createConfig({
  autoConnect: false,
  publicClient,
  // webSocketPublicClient,
  // logger: {
  //   warn: null,
  // },
  // connectors: [
  //   new InjectedConnector({
  //     chains,
  //     options: {
  //       shimDisconnect: true,
  //     },
  //   }),
  //   new CoinbaseWalletConnector({
  //     chains,
  //     options: {
  //       appName: 'zenlink-interface',
  //     },
  //   }),
  //   new WalletConnectConnector({
  //     chains,
  //     options: {
  //       projectId: '2d54460dfe49ac687751d282d0c54590',
  //     },
  //   }),
  //   new TalismanConnector({ chains }),
  //   new SubWalletConnector({ chains }),
  //   new SafeConnector({ chains }),
  //   new LedgerConnector({ chains }),
  // ],
})
