import { Token } from '@zenlink-interface/currency'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { StorageContext } from '../context'
import type { TokenAsObject, WithStorageState } from '../types'

type UseCustomTokensReturn = [
  Record<string, Token>,
  {
    addCustomToken(payload: TokenAsObject): void
    addCustomTokens(payload: TokenAsObject[]): void
    removeCustomToken(payload: Pick<TokenAsObject, 'address' | 'chainId'>): void
  },
]

type UseCustomTokens = (context: StorageContext, chainId?: number) => UseCustomTokensReturn

export const useCustomTokens: UseCustomTokens = (context, chainId?: number) => {
  const { reducerPath } = context
  const { customTokens } = useSelector((state: WithStorageState) => state[reducerPath])
  const dispatch = useDispatch()

  const addCustomToken = useCallback(
    ({ symbol, address, chainId, name, decimals }: TokenAsObject) => {
      dispatch({ type: 'addCustomToken', payload: { symbol, address, chainId, name, decimals } })
    },
    [dispatch],
  )

  const addCustomTokens = useCallback(
    (tokens: TokenAsObject[]) => {
      dispatch({ type: 'addCustomTokens', payload: tokens })
    },
    [dispatch],
  )

  const removeCustomToken = useCallback(
    ({ address, chainId }: Pick<TokenAsObject, 'address' | 'chainId'>) => {
      dispatch({ type: 'removeCustomToken', payload: { address, chainId } })
    },
    [dispatch],
  )

  const tokens = useMemo(() => {
    if (!chainId || !customTokens[chainId])
      return {}
    return Object.entries(customTokens[chainId]).reduce<Record<string, Token>>(
      (acc, [k, { chainId, decimals, name, symbol, address }]) => {
        acc[k] = new Token({ chainId, decimals, name, symbol, address })
        return acc
      },
      {},
    )
  }, [chainId, customTokens])

  return [tokens, { addCustomToken, removeCustomToken, addCustomTokens }]
}
