import { useCallback } from 'react'
import type { Connector } from '../types'
import { ConnectorSource } from '../types'

export const connectors: Connector[] = [
  {
    source: ConnectorSource.MantaWallet,
    id: ConnectorSource.MantaWallet,
    name: 'MantaWallet',
    installUrl: 'https://chrome.google.com/webstore/detail/manta-wallet/enabgbdfcbaehmbigakijjabdpdnimlg',
  },
  {
    source: ConnectorSource.Polkadot,
    id: ConnectorSource.Polkadot,
    name: 'Polkadot-js',
    installUrl: 'https://github.com/polkadot-js/extension',
  },
  {
    source: ConnectorSource.Talisman,
    id: ConnectorSource.Talisman,
    name: 'Talisman',
    installUrl: 'https://www.talisman.xyz/wallet',
  },
  {
    source: ConnectorSource.Subwallet,
    id: ConnectorSource.Subwallet,
    name: 'Subwallet',
    installUrl: 'https://www.subwallet.app/download.html',
  },
]

export function useConnect(
  storageConnector: string | undefined,
  updateConnector?: (connector: string | undefined) => void,
) {
  const connect = useCallback((source: string) => {
    const connector = connectors.find(c => c.source === source)
    if (connector && updateConnector)
      updateConnector(connector.source)
  }, [updateConnector])

  return {
    currentConnector: connectors.find(c => c.source === storageConnector),
    connectors,
    connect,
  }
}
