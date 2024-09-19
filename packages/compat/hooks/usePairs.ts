import type { Pair } from '@zenlink-interface/amm'
import type { Currency } from '@zenlink-interface/currency'
import { ParachainId } from '@zenlink-interface/chain'
import { usePairs as useAmplitudePairs } from '@zenlink-interface/parachains-amplitude'
import { usePairs as useBifrostPairs } from '@zenlink-interface/parachains-bifrost'
import { usePairs as useWagmiPairs } from '@zenlink-interface/wagmi'
import { useMemo } from 'react'
import { isEvmNetwork, isSubstrateNetwork } from '../config'

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
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
  const wagmiPairs = useWagmiPairs(chainId, currencies, {
    enabled: config?.enabled ? config?.enabled : Boolean(chainId && isEvmNetwork(chainId)),
  })

  const bifrostPairs = useBifrostPairs(chainId, currencies, Boolean(chainId && isSubstrateNetwork(chainId)))

  const amplitudePairs = useAmplitudePairs(chainId, currencies, Boolean(chainId && isSubstrateNetwork(chainId)))

  return useMemo(() => {
    if (!chainId) {
      return {
        isLoading: false,
        isError: true,
        data: [[PairState.INVALID, null]],
      }
    }
    if (isEvmNetwork(chainId))
      return wagmiPairs

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudePairs
    else
      return bifrostPairs
  }, [amplitudePairs, bifrostPairs, chainId, wagmiPairs])
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
