import type { ApiPromise } from '@polkadot/api'
import { useContext, useMemo } from 'react'
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import type { ApiState } from '..'
import { PolkadotApiContext } from '../components'

export const useApis = (): Record<number, ApiPromise | undefined> => {
  const context = useContext(PolkadotApiContext)
  if (!context)
    throw new Error('Hook can only be used inside Polkadot Api Context')

  return context.apis
}

export const useApi = (chainId?: number): ApiPromise | undefined => {
  const context = useContext(PolkadotApiContext)
  if (!context)
    throw new Error('Hook can only be used inside Polkadot Api Context')

  return useMemo(
    () => chainId ? context.apis[chainId] : undefined,
    [chainId, context.apis],
  )
}

export const useApiStates = (chainId?: number): ApiState | undefined => {
  const context = useContext(PolkadotApiContext)
  if (!context)
    throw new Error('Hook can only be used inside Polkadot Api Context')

  return useMemo(
    () => chainId ? context.states[chainId] : undefined,
    [chainId, context.states],
  )
}

export const useProviderAccounts = (): InjectedAccountWithMeta[] | undefined => {
  const context = useContext(PolkadotApiContext)
  if (!context)
    throw new Error('Hook can only be used inside Polkadot Api Context')

  return context.accounts
}
