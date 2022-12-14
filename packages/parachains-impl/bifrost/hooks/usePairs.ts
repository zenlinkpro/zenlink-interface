import type { QueryableStorageEntry } from '@polkadot/api/types'
import { Pair } from '@zenlink-interface/amm'
import type { Currency, Token, Type } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import type { ZenlinkProtocolPrimitivesAssetId } from '@zenlink-interface/format'
import { addressToZenlinkAssetId } from '@zenlink-interface/format'
import { useApi, useCallMulti } from '@zenlink-interface/polkadot'
import type { OrmlTokensAccountData, PairStatus } from '@zenlink-types/bifrost/interfaces'
import { useMemo } from 'react'
import { isNativeCurrency } from '../libs'

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function getPairs(chainId: number | undefined, currencies: [Currency | undefined, Currency | undefined][]) {
  return currencies
    .filter((currencies): currencies is [Type, Type] => {
      const [currencyA, currencyB] = currencies
      return Boolean(
        chainId
        && currencyA
        && currencyB
        && currencyA.chainId === currencyB.chainId
        && !currencyA.wrapped.equals(currencyB.wrapped),
      )
    })
    .reduce<[Token[], Token[], [ZenlinkProtocolPrimitivesAssetId, ZenlinkProtocolPrimitivesAssetId][]]>(
      (acc, [currencyA, currencyB]) => {
        const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
          ? [currencyA.wrapped, currencyB.wrapped]
          : [currencyB.wrapped, currencyA.wrapped]

        acc[0].push(token0)
        acc[1].push(token1)
        acc[2].push([
          addressToZenlinkAssetId(token0.address),
          addressToZenlinkAssetId(token1.address),
        ])
        return acc
      },
      [[], [], []],
    )
}

export function uniqePairKey(tokenA: Token, tokenB: Token): string {
  return `${tokenA.address}-${tokenB.address}`
}

interface UsePairsReturn {
  isLoading: boolean
  isError: boolean
  data: [PairState, Pair | null][]
}

export function usePairs(
  chainId: number | undefined,
  currencies: [Currency | undefined, Currency | undefined][],
): UsePairsReturn {
  const api = useApi(chainId)
  const [tokensA, tokensB, statusParams] = useMemo(() => getPairs(chainId, currencies), [chainId, currencies])

  const pairStatuses = useCallMulti<PairStatus[]>({
    chainId,
    calls: statusParams
      .map(param => [api?.query.zenlinkProtocol.pairStatuses, param])
      .filter((call): call is [QueryableStorageEntry<'promise'>, [ZenlinkProtocolPrimitivesAssetId, ZenlinkProtocolPrimitivesAssetId]] => !!call[0]),
  })

  const pairAccounts = useMemo(
    () => pairStatuses.reduce<Record<string, string>>(
      (acc, status, i) => {
        if (status.isTrading)
          acc[uniqePairKey(tokensA[i], tokensB[i])] = status.asTrading.pair_account.toString()
        return acc
      },
      {},
    ),
    [pairStatuses, tokensA, tokensB],
  )

  const [validTokensA, validTokensB, reservesCalls] = useMemo(
    () => tokensA.reduce<[Token[], Token[], [QueryableStorageEntry<'promise'>, ...unknown[]][]]>(
      (acc, tokenA, i) => {
        const pairAccount = pairAccounts[uniqePairKey(tokenA, tokensB[i])]
        if (pairAccount && api) {
          acc[0].push(tokenA)
          acc[1].push(tokensB[i])
          acc[2].push([
            isNativeCurrency(tokenA) ? api.query.system.account : api.query.tokens.accounts,
            isNativeCurrency(tokenA) ? [pairAccount] : [pairAccount, addressToZenlinkAssetId(tokenA.address)],
          ])
          acc[2].push([
            isNativeCurrency(tokensB[i]) ? api.query.system.account : api.query.tokens.accounts,
            isNativeCurrency(tokensB[i]) ? [pairAccount] : [pairAccount, addressToZenlinkAssetId(tokensB[i].address)],
          ])
        }
        return acc
      },
      [[], [], []],
    ),
    [api, pairAccounts, tokensA, tokensB],
  )

  const reserves = useCallMulti<OrmlTokensAccountData[]>({ chainId, calls: reservesCalls })

  return useMemo(() => {
    if (!reserves.length) {
      return {
        isLoading: true,
        isError: false,
        data: validTokensA.map(() => [PairState.LOADING, null]),
      }
    }

    return {
      isLoading: Boolean(reserves.length),
      isError: false,
      data: validTokensA.map((tokenA, i) => {
        const tokenB = validTokensB[i]
        if (!tokenA || !tokenB || tokenA.equals(tokenB))
          return [PairState.INVALID, null]

        const reserve0 = reserves[i * 2]
        const reserve1 = reserves[i * 2 + 1]
        if (!reserve0 || !reserve1 || reserve0.isEmpty || reserve1.isEmpty)
          return [PairState.NOT_EXISTS, null]

        return [
          PairState.EXISTS,
          new Pair(
            Amount.fromRawAmount(tokenA, reserve0.free.toString()),
            Amount.fromRawAmount(tokenB, reserve1.free.toString()),
          ),
        ]
      }),
    }
  }, [reserves, validTokensA, validTokensB])
}

interface UsePairReturn {
  isLoading: boolean
  isError: boolean
  data: [PairState, Pair | null]
}

export function usePair(
  chainId: number,
  tokenA?: Currency,
  tokenB?: Currency,
): UsePairReturn {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  const { data, isLoading, isError } = usePairs(chainId, inputs)

  return useMemo(
    () => ({
      isLoading,
      isError,
      data: data?.[0],
    }),
    [data, isError, isLoading],
  )
}
