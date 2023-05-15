import type { StableSwap as StableSwapContract } from '@zenlink-dex/zenlink-evm-contracts'
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
      })),
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePool,
        functionName: 'getLpToken',
      })),
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePool,
        functionName: 'getTokenBalances',
      })),
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePool,
        functionName: 'swapStorage',
      })),
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePool,
        functionName: 'getA',
      })),
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePool,
        functionName: 'getVirtualPrice',
      })),
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
    })),
    enabled: stablePoolData && stablePoolData.length > 0 && config?.enabled,
    watch: !config?.enabled,
  })

  return useMemo(() => {
    return {
      isLoading: stablePoolLoading || lpTotalSupplyLoading,
      isError: stablePoolError || lpTotalSupplyError,
      data: poolsAddresses.map((address, i) => {
        const tokens = stablePoolData?.[i]?.result as Awaited<ReturnType<StableSwapContract['getTokens']>>
        const lpToken = stablePoolData?.[i + poolsAddresses.length]?.result as Awaited<ReturnType<StableSwapContract['getLpToken']>>
        const tokenBalances = stablePoolData?.[i + poolsAddresses.length * 2]?.result as Awaited<ReturnType<StableSwapContract['getTokenBalances']>>
        const swapStorage = stablePoolData?.[i + poolsAddresses.length * 3]?.result as Awaited<ReturnType<StableSwapContract['swapStorage']>>
        const A = stablePoolData?.[i + poolsAddresses.length * 4]?.result as Awaited<ReturnType<StableSwapContract['getA']>>
        const virtualPrice = stablePoolData?.[i + poolsAddresses.length * 5]?.result as Awaited<ReturnType<StableSwapContract['getVirtualPrice']>>
        const totalSupply = lpTotalSupply?.[i]?.result as bigint

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
            JSBI.BigInt(swapStorage.fee.toString()),
            JSBI.BigInt(swapStorage.adminFee.toString()),
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
