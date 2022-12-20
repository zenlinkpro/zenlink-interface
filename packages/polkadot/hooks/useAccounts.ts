import type { SubjectInfo } from '@polkadot/ui-keyring/observable/types'

import { useEffect, useState } from 'react'

import { keyring } from '@polkadot/ui-keyring'
import { nextTick, u8aToHex } from '@polkadot/util'
import { decodeAddress } from '@polkadot/util-crypto'
import { useIsMounted } from '@zenlink-interface/hooks'
import type { Connector } from '../types'
import { ConnectorSource } from '../types'

export interface Account {
  name: string | undefined
  address: string
}

export interface UseAccounts {
  allAccounts: Account[]
  allAccountsHex: string[]
  areAccountsLoaded: boolean
  hasAccounts: boolean
  isAccount: (address?: string | null) => boolean
}

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
]

const EMPTY: UseAccounts = { allAccounts: [], allAccountsHex: [], areAccountsLoaded: false, hasAccounts: false, isAccount: () => false }

function extractAccounts(accounts: SubjectInfo = {}, connector: Connector): UseAccounts {
  const allSingleAddresses = Object.values(accounts)
  const allAccounts = Object.keys(accounts)
    .filter((_, i) => (allSingleAddresses[i].json.meta?.source as string) === connector.source)
    .map((address, i) => ({ name: allSingleAddresses[i].json.meta.name, address }))
  const allAccountsHex = allAccounts.map(a => u8aToHex(decodeAddress(a.address)))
  const hasAccounts = allAccounts.length !== 0
  const isAccount = (address?: string | null) =>
    !!address && allAccounts.some(account => account.address === address)
  return { allAccounts, allAccountsHex, areAccountsLoaded: true, hasAccounts, isAccount }
}

export function useAccounts(connector = connectors[0]) {
  const isMounted = useIsMounted()
  const [state, setState] = useState<UseAccounts>(EMPTY)

  useEffect(() => {
    const subscription = keyring.accounts.subject.subscribe((accounts = {}) =>
      isMounted && setState(extractAccounts(accounts, connector)),
    )

    return () => {
      nextTick(() => subscription.unsubscribe())
    }
  }, [connector, isMounted])

  return state
}
