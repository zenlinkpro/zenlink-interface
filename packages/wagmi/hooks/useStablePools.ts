import { Amount, Token } from '@zenlink-interface/currency'
import { useMemo } from 'react'
import { STABLE_LP_OVERRIDE, STABLE_POOL_ADDRESS, StableSwap } from '@zenlink-interface/amm'
import type { Address } from 'wagmi'
import { erc20ABI, useContractReads } from 'wagmi'
import { JSBI } from '@zenlink-interface/math'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { StableSwapWithBase } from '../types'
import { stablePool } from '../abis'

export enum StablePoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function useGetStablePools(
  chainId: number | undefined,
  tokenMap: { [address: string]: Token },
  addresses: string[] = [],
  config = { enabled: true },
): {
    isLoading: boolean
    isError: boolean
    data: [StablePoolState, StableSwap | null][]
  } {
  const poolsAddresses = useMemo(
    () => addresses.length
      ? addresses as Address[]
      : STABLE_POOL_ADDRESS[chainId ?? -1] as Address[] ?? [],
    [addresses, chainId],
  )

  const {
    data: stablePoolData,
    isLoading: stablePoolLoading,
    isError: stablePoolError,
  } = useContractReads({
    contracts: [
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePool,
        functionName: 'getTokens',
      } as const)),
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePool,
        functionName: 'getLpToken',
      } as const)),
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePool,
        functionName: 'getTokenBalances',
      } as const)),
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePool,
        functionName: 'swapStorage',
      } as const)),
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePool,
        functionName: 'getA',
      } as const)),
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePool,
        functionName: 'getVirtualPrice',
      } as const)),
    ],
    enabled: poolsAddresses.length > 0 && config?.enabled,
    watch: !config?.enabled,
  })

  const {
    data: lpTotalSupply,
    isLoading: lpTotalSupplyLoading,
    isError: lpTotalSupplyError,
  } = useContractReads({
    contracts: poolsAddresses.map((_, i) => ({
      chainId: chainsParachainIdToChainId[chainId ?? -1],
      address: (stablePoolData?.[i + poolsAddresses.length] ?? '') as Address,
      abi: erc20ABI,
      functionName: 'totalSupply',
    } as const)),
    enabled: stablePoolData && stablePoolData.length > 0 && config?.enabled,
    watch: !config?.enabled,
  })

  return useMemo(() => {
    return {
      isLoading: stablePoolLoading || lpTotalSupplyLoading,
      isError: stablePoolError || lpTotalSupplyError,
      data: poolsAddresses.map((address, i) => {
        const tokens = stablePoolData?.[i]?.result as Address[]
        const lpToken = stablePoolData?.[i + poolsAddresses.length]?.result as Address
        const tokenBalances = stablePoolData?.[i + poolsAddresses.length * 2]?.result as bigint[]
        const swapStorage = stablePoolData?.[i + poolsAddresses.length * 3]?.result as [`0x${string}`, bigint, bigint, bigint, bigint, bigint, bigint]
        const A = stablePoolData?.[i + poolsAddresses.length * 4]?.result as bigint
        const virtualPrice = stablePoolData?.[i + poolsAddresses.length * 5]?.result as bigint
        const totalSupply = lpTotalSupply?.[i]?.result

        if (
          !chainId
          || !tokens
          || !lpToken
          || !tokenBalances
          || !swapStorage
          || !A
          || !virtualPrice
          || !totalSupply
          || !tokens.every(address => address in tokenMap)
        ) return [StablePoolState.LOADING, null]

        const liquidityToken = new Token({
          chainId,
          address: lpToken,
          decimals: 18,
          symbol: STABLE_LP_OVERRIDE[chainId]?.[lpToken].symbol,
          name: STABLE_LP_OVERRIDE[chainId]?.[lpToken].name,
        })
        const pooledTokens = tokens.map(address => tokenMap[address])

        return [
          StablePoolState.EXISTS,
          new StableSwap(
            chainId,
            address,
            pooledTokens,
            liquidityToken,
            Amount.fromRawAmount(liquidityToken, totalSupply.toString()),
            tokenBalances.map((balance, i) => Amount.fromRawAmount(pooledTokens[i], balance.toString())),
            JSBI.BigInt(swapStorage[1].toString()),
            JSBI.BigInt(swapStorage[2].toString()),
            JSBI.BigInt(A.toString()),
            JSBI.BigInt(virtualPrice.toString()),
          ),
        ]
      }),
    }
  }, [stablePoolLoading, lpTotalSupplyLoading, stablePoolError, lpTotalSupplyError, poolsAddresses, stablePoolData, lpTotalSupply, chainId, tokenMap])
}

export function generateStableSwapWithBase(swaps: StableSwap[]): StableSwapWithBase[] {
  return swaps.map((swap) => {
    const baseSwap = swaps.find(
      baseSwap => swap.involvesToken(baseSwap.liquidityToken),
    )

    return baseSwap ? Object.assign(swap, { baseSwap }) : swap
  })
}

interface UseStableSwapWithBaseReturn {
  isLoading: boolean
  isError: boolean
  data: StableSwapWithBase | undefined
}

export function useStableSwapWithBase(
  chainId: number,
  tokenMap: { [address: string]: Token },
  address?: string,
  config?: { enabled: boolean },
): UseStableSwapWithBaseReturn {
  const { data, isLoading, isError } = useGetStablePools(chainId, tokenMap, [], config)

  return useMemo(
    () => {
      const pools = Object.values(
        data
          .filter((result): result is [StablePoolState.EXISTS, StableSwap] =>
            Boolean(result[0] === StablePoolState.EXISTS && result[1]))
          .map(([, stablePool]) => stablePool),
      )

      return {
        isLoading,
        isError,
        data: generateStableSwapWithBase(pools).find(swap => swap.contractAddress.toLowerCase() === address),
      }
    },
    [address, data, isError, isLoading],
  )
}
