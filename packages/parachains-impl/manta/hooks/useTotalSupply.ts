import type { ApiPromise } from '@polkadot/api'
import type { QueryableStorageMultiArg } from '@polkadot/api/types'
import type { Token } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import { useApis } from '@zenlink-interface/polkadot'
import { useEffect, useMemo, useState } from 'react'
import type { PalletAssetsAssetDetails } from '@polkadot/types/lookup'
import { addressToCurrencyId, isNativeCurrency } from '../libs'

export const useMultipleTotalSupply = (tokens?: Token[], enabled = true): Record<string, Amount<Token> | undefined> | undefined => {
  const apis = useApis()
  const [results, setResults] = useState<Record<string, Amount<Token> | undefined>>()

  const calls = useMemo(
    () => {
      const callsMap: Record<number, [ApiPromise, Token[], QueryableStorageMultiArg<'promise'>[]]> = {}
      ;(tokens || []).forEach((token) => {
        const api = apis[token.chainId]
        if (api) {
          const [, _tokens, calls] = callsMap[token.chainId] || [api, [], []]
          _tokens.push(token)
          if (isNativeCurrency(token))
            calls.push(api.query.balances.totalIssuance)
          else
            calls.push([api.query.assets.asset, addressToCurrencyId(token.address)])
          callsMap[token.chainId] = [api, _tokens, calls]
        }
      })
      return callsMap
    },
    [apis, tokens],
  )

  useEffect(() => {
    if (enabled) {
      Object.entries(calls).forEach(([, [api, tokens, calls]]) => {
        api.queryMulti(calls).then((results) => {
          results.forEach((result, i) => {
            const token = tokens[i]
            const supply = (result as PalletAssetsAssetDetails).supply || result
            setResults(results => ({
              ...results,
              [token.address]: supply ? Amount.fromRawAmount(token, supply.toHex()) : undefined,
            }))
          })
        })
      })
    }
  }, [calls, enabled])

  return results
}

export const useTotalSupply = (token?: Token, enabled = true): Amount<Token> | undefined => {
  const tokens = useMemo(() => (token ? [token] : undefined), [token])
  const resultMap = useMultipleTotalSupply(tokens, enabled)
  return useMemo(() => (token ? resultMap?.[token.wrapped.address] : undefined), [resultMap, token])
}
