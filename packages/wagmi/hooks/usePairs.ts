import { FACTORY_ADDRESS, Pair, computePairAddress } from '@zenlink-interface/amm'
import { chainsParachainIdToChainId, isEvmNetwork } from '@zenlink-interface/chain'
import type { Type as Currency, Token, Type } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import { useEffect, useMemo } from 'react'
import type { Address } from 'viem'
import { useReadContracts } from 'wagmi'
import { pair } from '../abis'
import { useBlockNumber } from './useBlockNumber'

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function getPairs(currencies: [Currency | undefined, Currency | undefined][]): [[Currency, Currency][], [Token[], Token[]]] {
  const validatedCurrencies = currencies
    .filter((currencies): currencies is [Type, Type] => {
      const [currencyA, currencyB] = currencies
      return Boolean(
        currencyA
        && currencyB
        && currencyA.chainId === currencyB.chainId
        && !currencyA.wrapped.equals(currencyB.wrapped)
        && FACTORY_ADDRESS[currencyA.chainId],
      )
    })

  return [
    validatedCurrencies,
    validatedCurrencies
      .reduce<[Token[], Token[]]>(
        (acc, [currencyA, currencyB]) => {
          acc[0].push(currencyA.wrapped)
          acc[1].push(currencyB.wrapped)
          return acc
        },
        [[], []],
      ),
  ]
}

interface UsePairsReturn {
  isLoading: boolean
  isError: boolean
  data: [PairState, Pair | null][]
}

export function usePairs(
  chainId: number | undefined,
  currencies: [Currency | undefined, Currency | undefined][],
  config?: { enabled?: boolean },
): UsePairsReturn {
  const blockNumber = useBlockNumber(chainId)
  const [validatedCurrencies, [tokensA, tokensB]] = useMemo(() => getPairs(currencies), [currencies])

  const contracts = useMemo(
    () => validatedCurrencies.map(([currencyA, currencyB]) => ({
      chainId: chainsParachainIdToChainId[chainId && isEvmNetwork(chainId) ? chainId : -1],
      address: computePairAddress({
        factoryAddress: FACTORY_ADDRESS[currencyA.chainId],
        tokenA: currencyA.wrapped,
        tokenB: currencyB.wrapped,
      }) as Address,
      abi: pair,
      functionName: 'getReserves',
    } as const)),
    [chainId, validatedCurrencies],
  )

  const { data, isLoading, isError, refetch } = useReadContracts({ contracts })

  useEffect(() => {
    if (config?.enabled && blockNumber && contracts.length > 0)
      refetch()
  }, [blockNumber, config?.enabled, contracts.length, refetch])

  return useMemo(() => {
    if (contracts.length === 0)
      return { isLoading, isError, data: [[PairState.INVALID, null]] }
    if (!data) {
      return {
        isLoading,
        isError,
        data: contracts.map(() => [PairState.LOADING, null]),
      }
    }

    return {
      isLoading,
      isError,
      data: data.map((result, i) => {
        const tokenA = tokensA[i]
        const tokenB = tokensB[i]
        if (!tokenA || !tokenB || tokenA.equals(tokenB))
          return [PairState.INVALID, null]
        if (!result || result.status !== 'success')
          return [PairState.NOT_EXISTS, null]

        const [reserve0, reserve1] = result.result
        const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
        return [
          PairState.EXISTS,
          new Pair(
            Amount.fromRawAmount(token0, reserve0.toString()),
            Amount.fromRawAmount(token1, reserve1.toString()),
          ),
        ]
      }),
    }
  }, [contracts, data, isError, isLoading, tokensA, tokensB])
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
  config?: { enabled?: boolean },
): UsePairReturn {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  const { data, isLoading, isError } = usePairs(chainId, inputs, config)

  return useMemo(
    () => ({
      isLoading,
      isError,
      data: data?.[0],
    }),
    [data, isError, isLoading],
  )
}
