import type { ApiPromise } from '@polkadot/api'
import { useContext, useMemo } from 'react'
import type { ApiState } from '..'
import { PolkadotApiContext } from '../components'

export const useApi = (chainId: number): ApiPromise | undefined => {
  const context = useContext(PolkadotApiContext)
  if (!context)
    throw new Error('Hook can only be used inside Polkadot Api Context')

  return useMemo(
    () => context.apis[chainId],
    [chainId, context.apis],
  )
}

export const useApiStates = (chainId: number): ApiState | undefined => {
  const context = useContext(PolkadotApiContext)
  if (!context)
    throw new Error('Hook can only be used inside Polkadot Api Context')

  return useMemo(
    () => context.states[chainId],
    [chainId, context.states],
  )
}
