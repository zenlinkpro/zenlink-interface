import type { Connector } from '../types'

import { useCallback } from 'react'
import { ConnectorSource } from '../types'

export const connectors: Connector[] = [
  {
    source: ConnectorSource.Polkadot,
    id: ConnectorSource.Polkadot,
    name: 'Polkadot-js',
  },
  {
    source: ConnectorSource.Talisman,
    id: ConnectorSource.Talisman,
    name: 'Talisman',
  },
  {
    source: ConnectorSource.Subwallet,
    id: ConnectorSource.Subwallet,
    name: 'Subwallet',
  },
  {
    source: ConnectorSource.WalletConnect,
    id: ConnectorSource.WalletConnect,
    name: 'WalletConnect',
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
