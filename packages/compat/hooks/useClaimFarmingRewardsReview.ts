import {ParachainId} from "@zenlink-interface/chain";
import {useClaimFarmingRewardsReview as useWagmiClaimFarmingRewardsReview} from '@zenlink-interface/wagmi'
import {
  useClaimFarmingRewardsReview as useBifrostClaimFarmingRewardsReview
} from '@zenlink-interface/parachains-bifrost'
import {
  useClaimFarmingRewardsReview as useAmplitudeClaimFarmingRewardsReview
} from '@zenlink-interface/parachains-amplitude'
import {useMemo} from 'react'
import {isEvmNetwork} from '../config'

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

    if (chainId === ParachainId.AMPLITUDE)
        return amplitudeClaimFarmingRewardsReview
    else
      return bifrostClaimFarmingRewardsReview
  }, [bifrostClaimFarmingRewardsReview, chainId, wagmiClaimFarmingRewardsReview])
}
