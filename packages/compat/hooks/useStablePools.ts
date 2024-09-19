import type { StableSwap } from '@zenlink-interface/amm'
import type { Token } from '@zenlink-interface/currency'
import type { StableSwapWithBase } from '../types'
import { ParachainId } from '@zenlink-interface/chain'
import { useGetStablePools as useAmplitudeGetStablePools } from '@zenlink-interface/parachains-amplitude'
import { useGetStablePools as useBifrostGetStablePools } from '@zenlink-interface/parachains-bifrost'
import { useGetStablePools as useWagmiGetStablePools } from '@zenlink-interface/wagmi'
import { useMemo } from 'react'
import { isEvmNetwork } from '../config'

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
  const wagmiStablePools = useWagmiGetStablePools(chainId, tokenMap, addresses, {
    enabled: Boolean(config.enabled && chainId && isEvmNetwork(chainId)),
  })
  const bifrostStablePools = useBifrostGetStablePools()
  const amplitudeStablePools = useAmplitudeGetStablePools()

  return useMemo(() => {
    if (!chainId) {
      return {
        isLoading: false,
        isError: true,
        data: [],
      }
    }

    if (isEvmNetwork(chainId))
      return wagmiStablePools

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudeStablePools
    else
      return bifrostStablePools
  }, [amplitudeStablePools, bifrostStablePools, chainId, wagmiStablePools])
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
