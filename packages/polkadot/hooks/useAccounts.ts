import type { SubjectInfo } from '@polkadot/ui-keyring/observable/types'

import { useEffect, useState } from 'react'

import { keyring } from '@polkadot/ui-keyring'
import { nextTick, u8aToHex } from '@polkadot/util'
import { decodeAddress } from '@polkadot/util-crypto'
import { useIsMounted } from '@zenlink-interface/hooks'

export interface UseAccounts {
  allAccounts: string[]
  allAccountsHex: string[]
  areAccountsLoaded: boolean
  hasAccounts: boolean
  isAccount: (address?: string | null) => boolean
}

const EMPTY: UseAccounts = { allAccounts: [], allAccountsHex: [], areAccountsLoaded: false, hasAccounts: false, isAccount: () => false }

function extractAccounts(accounts: SubjectInfo = {}): UseAccounts {
  const allAccounts = Object.keys(accounts)
  const allAccountsHex = allAccounts.map(a => u8aToHex(decodeAddress(a)))
  const hasAccounts = allAccounts.length !== 0
  const isAccount = (address?: string | null) => !!address && allAccounts.includes(address)

  return { allAccounts, allAccountsHex, areAccountsLoaded: true, hasAccounts, isAccount }
}

export function useAccounts() {
  const isMounted = useIsMounted()
  const [state, setState] = useState<UseAccounts>(EMPTY)

  useEffect(() => {
    const subscription = keyring.accounts.subject.subscribe((accounts = {}) =>
      isMounted && setState(extractAccounts(accounts)),
    )

    return () => {
      nextTick(() => subscription.unsubscribe())
    }
  }, [isMounted])

  return state
}
