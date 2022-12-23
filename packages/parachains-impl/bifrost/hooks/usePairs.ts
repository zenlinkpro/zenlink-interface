import type { QueryableStorageEntry } from '@polkadot/api/types'
import type { Struct } from '@polkadot/types-codec'
import { Pair } from '@zenlink-interface/amm'
import type { Currency, Token, Type } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import type { ZenlinkProtocolPrimitivesAssetId } from '@zenlink-interface/format'
import { addressToZenlinkAssetId } from '@zenlink-interface/format'
import { useApi, useCallMulti } from '@zenlink-interface/polkadot'
import type { AccountId, OrmlTokensAccountData, ZenlinkAssetBalance } from '@zenlink-types/bifrost/interfaces'
import type { FrameSystemAccountInfo } from '@polkadot/types/lookup'
import { useMemo } from 'react'
import { PAIR_ADDRESSES, addressToNodeCurrency, isNativeCurrency } from '../libs'

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

export interface ZenlinkPairMetadata extends Struct {
  readonly pairAccount: AccountId
  readonly targetSupply: ZenlinkAssetBalance
}

export function usePairs(
  chainId: number | undefined,
  currencies: [Currency | undefined, Currency | undefined][],
): UsePairsReturn {
  const api = useApi(chainId)
  const [tokensA, tokensB] = useMemo(() => getPairs(chainId, currencies), [chainId, currencies])

  const [validTokensA, validTokensB, reservesCalls] = useMemo(
    () => tokensA.reduce<[Token[], Token[], [QueryableStorageEntry<'promise'>, ...unknown[]][]]>(
      (acc, tokenA, i) => {
        const tokenB = tokensB[i]
        const pairKey = uniqePairKey(tokenA, tokenB)
        const pairAccount = PAIR_ADDRESSES[pairKey]?.account
        if (pairAccount && api) {
          acc[0].push(tokenA)
          acc[1].push(tokenB)
          if (isNativeCurrency(tokenA))
            acc[2].push([api.query.system.account, pairAccount])
          else
            acc[2].push([api.query.tokens.accounts, [pairAccount, addressToNodeCurrency(tokenA.address)]])

          if (isNativeCurrency(tokenB))
            acc[2].push([api.query.system.account, pairAccount])
          else
            acc[2].push([api.query.tokens.accounts, [pairAccount, addressToNodeCurrency(tokenB.address)]])
        }
        return acc
      },
      [[], [], []],
    ),
    [api, tokensA, tokensB],
  )

  const reserves = useCallMulti<(OrmlTokensAccountData | FrameSystemAccountInfo)[]>({
    chainId,
    calls: reservesCalls,
    options: { defaultValue: [] },
  })

  return useMemo(() => {
    if (!reserves.length || reserves.length !== validTokensA.length * 2) {
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

        const pairKey = uniqePairKey(tokenA, tokenB)
        const reserve0 = reserves[i * 2]
        const reserve1 = reserves[i * 2 + 1]
        const pairAddress = PAIR_ADDRESSES[pairKey]?.address
        if (!reserve0 || !reserve1 || reserve0.isEmpty || reserve1.isEmpty || !pairAddress)
          return [PairState.NOT_EXISTS, null]

        return [
          PairState.EXISTS,
          new Pair(
            Amount.fromRawAmount(
              tokenA,
              ((reserve0 as FrameSystemAccountInfo).data || reserve0).free.toString(),
            ),
            Amount.fromRawAmount(
              tokenB,
              ((reserve1 as FrameSystemAccountInfo).data || reserve1).free.toString(),
            ),
            pairAddress,
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
