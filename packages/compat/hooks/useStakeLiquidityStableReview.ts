import type { Amount, Type } from '@zenlink-interface/currency'
import { ParachainId } from '@zenlink-interface/chain'
import {
  useStakeLiquidityStandardReview as useAmplitudeStakeLiquidityStandardReview,
} from '@zenlink-interface/parachains-amplitude'
import {
  useStakeLiquidityStandardReview as useBifrostStakeLiquidityStandardReview,
} from '@zenlink-interface/parachains-bifrost'
import { useStakeLiquidityReview as useWagmiStakeLiquidityReview } from '@zenlink-interface/wagmi'
import { useMemo } from 'react'
import { isEvmNetwork } from '../config'

interface UseStakeLiquidityStableReviewParams {
  chainId: ParachainId
  pid: number
  amountToStake: Amount<Type> | undefined
}

type UseStakeLiquidityStableReview = (params: UseStakeLiquidityStableReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  farmAddress: string | undefined
}

export const useStakeLiquidityStableReview: UseStakeLiquidityStableReview = ({
  chainId,
  ...params
}) => {
  const wagmiReview = useWagmiStakeLiquidityReview({
    chainId,
    ...params,
  })

  const bifrostReview = useBifrostStakeLiquidityStandardReview({
    chainId,
    ...params,
  })

  const amplitudeReview = useAmplitudeStakeLiquidityStandardReview({
    chainId,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiReview

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudeReview
    else
      return bifrostReview
  }, [chainId, wagmiReview, amplitudeReview, bifrostReview])
}
