import stablePoolArtifact from '@zenlink-dex/zenlink-evm-contracts/abi/StableSwap.json'
import type { StableSwap as StableSwapContract } from '@zenlink-dex/zenlink-evm-contracts'
import type { Token } from '@zenlink-interface/currency'
import type { UseContractReadsConfig } from 'wagmi/dist/declarations/src/hooks/contracts/useContractReads'
import { useMemo } from 'react'
import { STABLE_POOL_ADDRESS } from '@zenlink-interface/amm'
import { useContractReads } from 'wagmi'
import { chainsChainIdToParachainId } from '@zenlink-interface/chain'

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
) {
  const poolsAddresses = useMemo(() => STABLE_POOL_ADDRESS[chainId ?? -1] ?? [], [chainId])

  const {
    data: stablePoolData,
    isLoading: stablePoolLoading,
    isError: stablePoolError,
  } = useContractReads({
    contracts: [
      ...poolsAddresses.map(address => ({
        chainId: chainsChainIdToParachainId[chainId ?? -1],
        address,
        abi: stablePoolArtifact,
        functionName: 'getTokens',
      })),
      ...poolsAddresses.map(address => ({
        chainId: chainsChainIdToParachainId[chainId ?? -1],
        address,
        abi: stablePoolArtifact,
        functionName: 'getLpToken',
      })),
      ...poolsAddresses.map(address => ({
        chainId: chainsChainIdToParachainId[chainId ?? -1],
        address,
        abi: stablePoolArtifact,
        functionName: 'getTokenBalances',
      })),
      ...poolsAddresses.map(address => ({
        chainId: chainsChainIdToParachainId[chainId ?? -1],
        address,
        abi: stablePoolArtifact,
        functionName: 'swapStorage',
      })),
      ...poolsAddresses.map(address => ({
        chainId: chainsChainIdToParachainId[chainId ?? -1],
        address,
        abi: stablePoolArtifact,
        functionName: 'getA',
      })),
      ...poolsAddresses.map(address => ({
        chainId: chainsChainIdToParachainId[chainId ?? -1],
        address,
        abi: stablePoolArtifact,
        functionName: 'getVirtualPrice',
      })),
    ],
    enabled: poolsAddresses.length > 0 && config?.enabled,
    watch: !config?.enabled,
  })

  return useMemo(() => [stablePoolData, stablePoolLoading, stablePoolError], [stablePoolData, stablePoolLoading, stablePoolError])
}
