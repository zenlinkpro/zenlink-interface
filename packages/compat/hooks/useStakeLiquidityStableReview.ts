import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Type } from '@zenlink-interface/currency'
import { useStakeLiquidityReview as useWagmiStakeLiquidityReview } from '@zenlink-interface/wagmi'
import { useStakeLiquidityStandardReview as useBifrostStakeLiquidityStandardReview } from '@zenlink-interface/parachains-manta'
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

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiReview

    return bifrostReview
  }, [chainId, wagmiReview, bifrostReview])
}
