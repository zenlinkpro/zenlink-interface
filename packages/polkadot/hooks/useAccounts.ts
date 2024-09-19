/* eslint-disable no-console */
import type { Signer } from '@polkadot/types/types'
import type { BaseWallet, Account as OnBoardAccount } from '@polkadot-onboard/core'
import type { Connector } from '../types'
import { u8aToHex } from '@polkadot/util'
import { decodeAddress } from '@polkadot/util-crypto'
import { useIsMounted } from '@zenlink-interface/hooks'

import { useEffect, useState } from 'react'
import { useProviderAccounts } from './useApi'

if (!console.assert) {
  console.assert = (condition, message) => {
    if (!condition)
      throw new Error(typeof message === 'string' ? `Assertion failed: ${message}` : 'Assertion failed: console.assert')
  }
}

export interface Account {
  name: string | undefined
  address: string
  source: string
  signer: Signer | undefined
}

export interface UseAccounts {
  allAccounts: Account[]
  allAccountsHex: string[]
  areAccountsLoaded: boolean
  hasAccounts: boolean
  isAccount: (address?: string | null) => boolean
}

const EMPTY: UseAccounts = { allAccounts: [], allAccountsHex: [], areAccountsLoaded: false, hasAccounts: false, isAccount: () => false }

function extractAccounts(accounts: OnBoardAccount[] = [], wallet: BaseWallet, connector: Connector): UseAccounts {
  const allAccounts = accounts.map(account => ({
    name: account.name,
    address: account.address,
    source: connector.source,
    signer: wallet.signer,
  }))
  const allAccountsHex = allAccounts.map(a => u8aToHex(decodeAddress(a.address)))
  const hasAccounts = allAccounts.length !== 0
  const isAccount = (address?: string | null) =>
    !!address && allAccounts.some(account => account.address === address)
  return { allAccounts, allAccountsHex, areAccountsLoaded: true, hasAccounts, isAccount }
}

export function useAccounts(connector?: Connector) {
  const isMounted = useIsMounted()
  const [state, setState] = useState<UseAccounts>(EMPTY)
  const { accounts, wallet } = useProviderAccounts()

  useEffect(() => {
    if (isMounted && connector && wallet)
      setState(extractAccounts(accounts, wallet, connector))
  }, [accounts, connector, isMounted, wallet])

  return state
}
