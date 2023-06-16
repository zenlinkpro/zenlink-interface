import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Type } from '@zenlink-interface/currency'
import type { Dispatch, SetStateAction } from 'react'
import { useMemo } from 'react'
import { useAddLiquidityStandardReview as useWagmiAddLiquidityStandardReview } from '@zenlink-interface/wagmi'
import { useAddLiquidityStandardReview as useBifrostAddLiquidityStandardReview } from '@zenlink-interface/parachains-manta'
import { isEvmNetwork } from '../config'
import type { PairState } from './usePairs'

interface UseAddLiquidityStandardReviewParams {
  chainId: ParachainId
  poolState: PairState
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  setOpen: Dispatch<SetStateAction<boolean>>
}

type UseAddLiquidityStandardReview = (params: UseAddLiquidityStandardReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useAddLiquidityStandardReview: UseAddLiquidityStandardReview = ({
  chainId,
  ...params
}) => {
  const wagmiAddLiquidityStandardReview = useWagmiAddLiquidityStandardReview({
    chainId,
    ...params,
  })

  const bifrostAddLiquidityStandardReview = useBifrostAddLiquidityStandardReview({
    chainId,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiAddLiquidityStandardReview

    return bifrostAddLiquidityStandardReview
  }, [bifrostAddLiquidityStandardReview, chainId, wagmiAddLiquidityStandardReview])
}
