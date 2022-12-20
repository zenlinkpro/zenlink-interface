import { useSettings } from '@zenlink-interface/shared'
import { useCallback, useMemo } from 'react'
import { useAccounts } from './useAccounts'
import { useConnect } from './useConnect'

export function useAccount() {
  const [{ polkadotAddress, polkadotConnector }, { updatePolkadotAddress }] = useSettings()
  const { currentConnector } = useConnect(polkadotConnector)
  const { allAccounts, areAccountsLoaded } = useAccounts(currentConnector)

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
      select,
    }
  }, [allAccounts, areAccountsLoaded, polkadotAddress, select])
}
