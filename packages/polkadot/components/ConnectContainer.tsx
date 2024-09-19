import type { WalletConnectConfiguration } from '@polkadot-onboard/wallet-connect'
import type { ReactNode } from 'react'
import { WalletAggregator } from '@polkadot-onboard/core'
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets'
import { WalletConnectProvider } from '@polkadot-onboard/wallet-connect'
import { PolkadotWalletsContextProvider } from './PolkadotWalletsContextProvider'

const APP_NAME = 'zenlink-interface'

interface Props {
  children: ReactNode
}

export function ConnectContainer({ children }: Props) {
  const walletConnectParams: WalletConnectConfiguration = {
    projectId: '2d54460dfe49ac687751d282d0c54590',
    relayUrl: 'wss://relay.walletconnect.com',
    metadata: {
      name: 'wallet-connect',
      description: 'zenlink-interface wallet connect',
      url: '#',
      icons: ['https://walletconnect.com/walletconnect-logo.png'],
    },
    chainIds: [
      // 'polkadot:e143f23803ac50e8f6f8e62695d1ce9e',
      // 'polkadot:91b171bb158e2d3848fa23a9f1c25182',
    ],
    optionalChainIds: [
      'polkadot:9f28c6a68e0fc9646eff64935684f6ee', // bifrost-kusama
      'polkadot:262e1b2ad728475fd6fe88e62d34c200', // bifrost-polkadot
      'polkadot:cceae7f3b9947cdb67369c026ef78efa', // amplitude
    ],
    onSessionDelete: () => {
      // do something when session is removed
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
