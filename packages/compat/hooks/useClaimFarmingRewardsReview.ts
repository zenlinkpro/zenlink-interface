import { ParachainId } from '@zenlink-interface/chain'
import {
  useClaimFarmingRewardsReview as useAmplitudeClaimFarmingRewardsReview,
} from '@zenlink-interface/parachains-amplitude'
import {
  useClaimFarmingRewardsReview as useBifrostClaimFarmingRewardsReview,
} from '@zenlink-interface/parachains-bifrost'
import { useClaimFarmingRewardsReview as useWagmiClaimFarmingRewardsReview } from '@zenlink-interface/wagmi'
import { useMemo } from 'react'
import { isEvmNetwork } from '../config'

interface UseClaimFarmingRewardsReviewParams {
  chainId: ParachainId
  pid: number
}

type UseClaimFarmingRewardsReview = (params: UseClaimFarmingRewardsReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  farmAddress: string | undefined
}

export const useClaimFarmingRewardsReview: UseClaimFarmingRewardsReview = ({
  chainId,
  ...params
}) => {
  const wagmiClaimFarmingRewardsReview = useWagmiClaimFarmingRewardsReview({
    chainId,
    ...params,
  })

  const bifrostClaimFarmingRewardsReview = useBifrostClaimFarmingRewardsReview({
    chainId,
    ...params,
  })

  const amplitudeClaimFarmingRewardsReview = useAmplitudeClaimFarmingRewardsReview({
    chainId,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiClaimFarmingRewardsReview

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudeClaimFarmingRewardsReview
    else
      return bifrostClaimFarmingRewardsReview
  }, [amplitudeClaimFarmingRewardsReview, bifrostClaimFarmingRewardsReview, chainId, wagmiClaimFarmingRewardsReview])
}
