import type { Account, BaseWallet } from '@polkadot-onboard/core'
import type { ApiPromise } from '@polkadot/api'
import type { ApiState } from '..'

import { useContext, useMemo } from 'react'
import { PolkadotApiContext } from '../components'

interface UseProviderAccounts {
  accounts: Account[]
  wallet: BaseWallet | undefined
  setAccounts: (accounts: Account[]) => void
  setWallet: (wallet: BaseWallet | undefined) => void
}

export function useApis(): Record<number, ApiPromise | undefined> {
  const context = useContext(PolkadotApiContext)
  if (!context)
    throw new Error('Hook can only be used inside Polkadot Api Context')

  return context.apis
}

export function useApi(chainId?: number): ApiPromise | undefined {
  const context = useContext(PolkadotApiContext)
  if (!context)
    throw new Error('Hook can only be used inside Polkadot Api Context')

  return useMemo(
    () => chainId ? context.apis[chainId] : undefined,
    [chainId, context.apis],
  )
}

export function useApiStates(chainId?: number): ApiState | undefined {
  const context = useContext(PolkadotApiContext)
  if (!context)
    throw new Error('Hook can only be used inside Polkadot Api Context')

  return useMemo(
    () => chainId ? context.states[chainId] : undefined,
    [chainId, context.states],
  )
}

export function useProviderAccounts(): UseProviderAccounts {
  const context = useContext(PolkadotApiContext)
  if (!context)
    throw new Error('Hook can only be used inside Polkadot Api Context')

  return useMemo(() => ({
    wallet: context.wallet,
    accounts: context.accounts,
    setAccounts: context.setAccounts,
    setWallet: context.setWallet,
  }), [context.accounts, context.setAccounts, context.setWallet, context.wallet])
}
