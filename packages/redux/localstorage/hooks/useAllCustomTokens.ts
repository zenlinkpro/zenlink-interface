import { Token } from '@zenlink-interface/currency'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { StorageContext } from '../context'
import type { TokenAsObject, WithStorageState } from '../types'

type UseCustomTokensReturn = [
  Record<string, Record<string, Token>>,
  {
    addCustomToken(payload: TokenAsObject): void
    removeCustomToken(payload: Pick<TokenAsObject, 'address' | 'chainId'>): void
  },
]

type UseAllCustomTokens = (context: StorageContext) => UseCustomTokensReturn

export const useAllCustomTokens: UseAllCustomTokens = (context) => {
  const { reducerPath } = context
  const { customTokens } = useSelector((state: WithStorageState) => state[reducerPath])
  const dispatch = useDispatch()

  const addCustomToken = useCallback(
    ({ symbol, address, chainId, name, decimals }: TokenAsObject) => {
      dispatch({ type: 'addCustomToken', payload: { symbol, address, chainId, name, decimals } })
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
    const chainIds = Object.keys(customTokens)
    return chainIds.reduce<Record<string, Record<string, Token>>>((acc, chainId) => {
      acc[chainId] = Object.entries(customTokens[+chainId]).reduce<Record<string, Token>>(
        (acc, [k, { chainId, decimals, name, symbol, address }]) => {
          acc[k] = new Token({ chainId, decimals, name, symbol, address })
          return acc
        },
        {},
      )
      return acc
    }, {})
  }, [customTokens])

  return [tokens, { addCustomToken, removeCustomToken }]
}
