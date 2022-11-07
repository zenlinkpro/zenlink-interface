import stablePoolArtifact from '@zenlink-dex/zenlink-evm-contracts/abi/StableSwap.json'
import type { StableSwap as StableSwapContract } from '@zenlink-dex/zenlink-evm-contracts'
import { Amount, Token } from '@zenlink-interface/currency'
import type { UseContractReadsConfig } from 'wagmi/dist/declarations/src/hooks/contracts/useContractReads'
import { useMemo } from 'react'
import { STABLE_LP_OVERRIDE, STABLE_POOL_ADDRESS, StableSwap } from '@zenlink-interface/amm'
import { erc20ABI, useContractReads } from 'wagmi'
import type { BigNumber } from 'ethers'
import { JSBI } from '@zenlink-interface/math'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'

export enum StablePoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function useGetStablePools(
  chainId: number | undefined,
  tokenMap: { [address: string]: Token },
  config: Omit<UseContractReadsConfig<StableSwapContract[]>, 'contracts'> = { enabled: true },
): {
    isLoading: boolean
    isError: boolean
    data: [StablePoolState, StableSwap | null][]
  } {
  const poolsAddresses = useMemo(() => STABLE_POOL_ADDRESS[chainId ?? -1] ?? [], [chainId])

  const {
    data: stablePoolData,
    isLoading: stablePoolLoading,
    isError: stablePoolError,
  } = useContractReads({
    contracts: [
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePoolArtifact,
        functionName: 'getTokens',
      })),
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePoolArtifact,
        functionName: 'getLpToken',
      })),
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePoolArtifact,
        functionName: 'getTokenBalances',
      })),
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePoolArtifact,
        functionName: 'swapStorage',
      })),
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePoolArtifact,
        functionName: 'getA',
      })),
      ...poolsAddresses.map(address => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address,
        abi: stablePoolArtifact,
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
      address: (stablePoolData?.[i + poolsAddresses.length] ?? '') as string,
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
        const tokens = stablePoolData?.[i] as Awaited<ReturnType<StableSwapContract['getTokens']>>
        const lpToken = stablePoolData?.[i + poolsAddresses.length] as Awaited<ReturnType<StableSwapContract['getLpToken']>>
        const tokenBalances = stablePoolData?.[i + poolsAddresses.length * 2] as Awaited<ReturnType<StableSwapContract['getTokenBalances']>>
        const swapStorage = stablePoolData?.[i + poolsAddresses.length * 3] as Awaited<ReturnType<StableSwapContract['swapStorage']>>
        const A = stablePoolData?.[i + poolsAddresses.length * 4] as Awaited<ReturnType<StableSwapContract['getA']>>
        const virtualPrice = stablePoolData?.[i + poolsAddresses.length * 5] as Awaited<ReturnType<StableSwapContract['getVirtualPrice']>>
        const totalSupply = lpTotalSupply?.[i] as BigNumber

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
  }, [
    stablePoolLoading,
    lpTotalSupplyLoading,
    stablePoolError,
    lpTotalSupplyError,
    poolsAddresses,
  ])
}
