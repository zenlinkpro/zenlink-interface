import type { SubjectInfo } from '@polkadot/ui-keyring/observable/types'

import { useEffect, useState } from 'react'

import { keyring } from '@polkadot/ui-keyring'
import { nextTick, u8aToHex } from '@polkadot/util'
import { decodeAddress } from '@polkadot/util-crypto'
import { useIsMounted } from '@zenlink-interface/hooks'
import type { Connector } from '../types'

export interface Account {
  name: string | undefined
  address: string
  source: string
}

export interface UseAccounts {
  allAccounts: Account[]
  allAccountsHex: string[]
  areAccountsLoaded: boolean
  hasAccounts: boolean
  isAccount: (address?: string | null) => boolean
}

const EMPTY: UseAccounts = { allAccounts: [], allAccountsHex: [], areAccountsLoaded: false, hasAccounts: false, isAccount: () => false }

function extractAccounts(accounts: SubjectInfo = {}, connector: Connector): UseAccounts {
  const allSingleAddresses = Object.values(accounts)
  const allAccounts = Object.keys(accounts)
    .map((address, i) => ({
      name: allSingleAddresses[i].json.meta.name,
      address,
      source: (allSingleAddresses[i].json.meta.source || '') as string,
    }))
    .filter((_, i) => (allSingleAddresses[i].json.meta?.source as string) === connector.source)
  const allAccountsHex = allAccounts.map(a => u8aToHex(decodeAddress(a.address)))
  const hasAccounts = allAccounts.length !== 0
  const isAccount = (address?: string | null) =>
    !!address && allAccounts.some(account => account.address === address)
  return { allAccounts, allAccountsHex, areAccountsLoaded: true, hasAccounts, isAccount }
}

export function useAccounts(connector?: Connector) {
  const isMounted = useIsMounted()
  const [state, setState] = useState<UseAccounts>(EMPTY)

  useEffect(() => {
    const subscription = keyring.accounts.subject.subscribe((accounts = {}) =>
      isMounted && connector && setState(extractAccounts(accounts, connector)),
    )

    return () => {
      nextTick(() => subscription.unsubscribe())
    }
  }, [connector, isMounted])

  return state
}
