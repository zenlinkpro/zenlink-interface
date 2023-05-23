/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { u8aToHex } from '@polkadot/util'
import { decodeAddress } from '@polkadot/util-crypto'
import { useIsMounted } from '@zenlink-interface/hooks'
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import type { Connector } from '../types'

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
}

export interface UseAccounts {
  allAccounts: Account[]
  allAccountsHex: string[]
  areAccountsLoaded: boolean
  hasAccounts: boolean
  isAccount: (address?: string | null) => boolean
}

const EMPTY: UseAccounts = { allAccounts: [], allAccountsHex: [], areAccountsLoaded: false, hasAccounts: false, isAccount: () => false }

function extractAccounts(accounts: InjectedAccountWithMeta[] = [], connector: Connector): UseAccounts {
  const allSingleAddresses = accounts
  const allAccounts = accounts
    .map((account, i) => ({
      name: allSingleAddresses[i].meta.name,
      address: account.address,
      source: allSingleAddresses[i].meta.source,
    }))
    .filter((_, i) => allSingleAddresses[i].meta?.source === connector.source)
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
    const subscription = import('@polkadot/extension-dapp')
      .then(async ({ web3AccountsSubscribe, web3Enable }) => {
        await web3Enable('zenlink-interface')
        return web3AccountsSubscribe((accounts) => {
          isMounted && connector && setState(extractAccounts(accounts, connector))
        })
      })

    return () => {
      subscription.then(unsub => unsub())
    }
  }, [connector, isMounted])

  return state
}
