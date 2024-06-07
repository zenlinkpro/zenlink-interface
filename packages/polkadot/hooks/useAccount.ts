import { useSettings } from '@zenlink-interface/shared'
import { useCallback, useMemo } from 'react'

import type { Account } from './useAccounts'
import { useAccounts } from './useAccounts'
import { useConnect } from './useConnect'

interface UseAccount {
  allAccounts: Account[]
  account: Account | undefined
  address: string | undefined
  isConnecting: boolean
  isConnected: boolean
  isAccount: (address?: string | null) => boolean
  select: (address: string | undefined) => void
}

export function useAccount(): UseAccount {
  const [{ polkadotAddress, polkadotConnector }, { updatePolkadotAddress }] = useSettings()
  const { currentConnector } = useConnect(polkadotConnector)
  const { allAccounts, areAccountsLoaded, isAccount } = useAccounts(currentConnector)

  const select = useCallback((address: string | undefined) => {
    const account = allAccounts.find(account => account.address === address)
    updatePolkadotAddress(account?.address)
  }, [allAccounts, updatePolkadotAddress])

  return useMemo(() => {
    const account = allAccounts.find(account => account.address === polkadotAddress)

    return {
      allAccounts,
      account: account || allAccounts[0],
      address: account?.address || allAccounts[0]?.address,
      isConnecting: !areAccountsLoaded,
      isConnected: areAccountsLoaded,
      isAccount,
      select,
    }
  }, [allAccounts, areAccountsLoaded, isAccount, polkadotAddress, select])
}
