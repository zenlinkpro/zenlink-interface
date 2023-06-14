import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Type } from '@zenlink-interface/currency'
import { useStakeLiquidityReview as useWagmiStakeLiquidityReview } from '@zenlink-interface/wagmi'
import { useStakeLiquidityStandardReview as useBifrostStakeLiquidityStandardReview } from '@zenlink-interface/parachains-manta'
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

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiStakeLiquidityStandardReview

    return bifrostStakeLiquidityStandardReview
  }, [bifrostStakeLiquidityStandardReview, chainId, wagmiStakeLiquidityStandardReview])
}
