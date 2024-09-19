import type { Pair } from '@zenlink-interface/amm'
import type { Amount, Type } from '@zenlink-interface/currency'
import type { Percent } from '@zenlink-interface/math'
import { ParachainId } from '@zenlink-interface/chain'
import {
  useRemoveLiquidityStandardReview as useAmplitudeRemoveLiquidityStandardReview,
} from '@zenlink-interface/parachains-amplitude'
import {
  useRemoveLiquidityStandardReview as useBifrostRemoveLiquidityStandardReview,
} from '@zenlink-interface/parachains-bifrost'
import { useRemoveLiquidityStandardReview as useWagmiRemoveLiquidityStandardReview } from '@zenlink-interface/wagmi'
import { useMemo } from 'react'
import { isEvmNetwork } from '../config'

interface UseRemoveLiquidityStandardReviewParams {
  chainId: ParachainId
  token0: Type
  token1: Type
  minAmount0: Amount<Type> | undefined
  minAmount1: Amount<Type> | undefined
  pool: Pair | null
  percentToRemove: Percent
  balance: Amount<Type> | undefined
}

type UseRemoveLiquidityStandardReview = (params: UseRemoveLiquidityStandardReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useRemoveLiquidityStandardReview: UseRemoveLiquidityStandardReview = ({
  chainId,
  ...params
}) => {
  const wagmiRemoveLiquidityStandardReview = useWagmiRemoveLiquidityStandardReview({
    chainId,
    ...params,
  })

  const bifrostRemoveLiquidityStandardReview = useBifrostRemoveLiquidityStandardReview({
    chainId,
    ...params,
  })

  const amplitudeRemoveLiquidityStandardReview = useAmplitudeRemoveLiquidityStandardReview({
    chainId,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiRemoveLiquidityStandardReview

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudeRemoveLiquidityStandardReview
    else
      return bifrostRemoveLiquidityStandardReview
  }, [amplitudeRemoveLiquidityStandardReview, bifrostRemoveLiquidityStandardReview, chainId, wagmiRemoveLiquidityStandardReview])
}
