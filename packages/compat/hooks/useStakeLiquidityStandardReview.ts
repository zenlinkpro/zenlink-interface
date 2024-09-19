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

interface UseStakeLiquidityStandardReviewParams {
  chainId: ParachainId
  pid: number
  amountToStake: Amount<Type> | undefined
}

type UseStakeLiquidityStandardReview = (params: UseStakeLiquidityStandardReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  farmAddress: string | undefined
}

export const useStakeLiquidityStandardReview: UseStakeLiquidityStandardReview = ({
  chainId,
  ...params
}) => {
  const wagmiStakeLiquidityStandardReview = useWagmiStakeLiquidityReview({
    chainId,
    ...params,
  })

  const bifrostStakeLiquidityStandardReview = useBifrostStakeLiquidityStandardReview({
    chainId,
    ...params,
  })

  const amplitudeStakeLiquidityStandardReview = useAmplitudeStakeLiquidityStandardReview({
    chainId,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiStakeLiquidityStandardReview

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudeStakeLiquidityStandardReview
    else
      return bifrostStakeLiquidityStandardReview
  }, [amplitudeStakeLiquidityStandardReview, bifrostStakeLiquidityStandardReview, chainId, wagmiStakeLiquidityStandardReview])
}
