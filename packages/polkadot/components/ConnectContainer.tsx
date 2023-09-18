import { WalletAggregator } from '@polkadot-onboard/core'
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets'
import { PolkadotWalletsContextProvider } from '@polkadot-onboard/react'
import type { WalletConnectConfiguration } from '@polkadot-onboard/wallet-connect'
import { WalletConnectProvider } from '@polkadot-onboard/wallet-connect'
import type { ReactNode } from 'react'

const APP_NAME = 'zenlink-interface'

interface Props {
  children: ReactNode
}

export const ConnectContainer = ({ children }: Props) => {
  const walletConnectParams: WalletConnectConfiguration = {
    projectId: '2d54460dfe49ac687751d282d0c54590',
    relayUrl: 'wss://relay.walletconnect.com',
    chainIds: [
      'polkadot:9f28c6a68e0fc9646eff64935684f6ee',
    ],
    metadata: {
      name: 'wallet-connect',
      description: 'zenlink-interface wallet connect',
      url: '#',
      icons: ['https://walletconnect.com/walletconnect-logo.png'],
    },
  }

  const walletAggregator = new WalletAggregator([
    new InjectedWalletProvider({}, APP_NAME),
    new WalletConnectProvider(walletConnectParams, APP_NAME),
  ])

  return (
    <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
      {children}
    </PolkadotWalletsContextProvider>
  )
}
