import type { StableSwap } from '@zenlink-interface/amm'
import { useMemo } from 'react'

export enum StablePoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

// TODO: Bifrost Stable Pools
export function useGetStablePools(): {
  isLoading: boolean
  isError: boolean
  data: [StablePoolState, StableSwap | null][]
} {
  return useMemo(() => {
    return {
      isLoading: false,
      isError: false,
      data: [],
    }
  }, [])
}
