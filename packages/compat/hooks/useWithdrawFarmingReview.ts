import type { Amount, Type } from '@zenlink-interface/currency'
import { ParachainId } from '@zenlink-interface/chain'
import { useWithdrawFarmingReview as useAmplitudeWithdrawFarmingReview } from '@zenlink-interface/parachains-amplitude'
import { useWithdrawFarmingReview as useBifrostWithdrawFarmingReview } from '@zenlink-interface/parachains-bifrost'
import { useWithdrawFarmingReview as useWagmiWithdrawFarmingReview } from '@zenlink-interface/wagmi'
import { useMemo } from 'react'
import { isEvmNetwork } from '../config'

interface UseWithdrawFarmingReviewParams {
  chainId: ParachainId
  farmAddress?: string
  pid: number
  amountToWithdraw: Amount<Type> | undefined
}

type UseWithdrawFarmingReview = (params: UseWithdrawFarmingReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  farmAddress: string | undefined
}

export const useWithdrawFarmingReview: UseWithdrawFarmingReview = ({
  chainId,
  ...params
}) => {
  const wagmiReview = useWagmiWithdrawFarmingReview({
    chainId,
    ...params,
  })

  const bifrostReview = useBifrostWithdrawFarmingReview({
    chainId,
    ...params,
  })

  const amplitudeReview = useAmplitudeWithdrawFarmingReview({
    chainId,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiReview

    if (chainId === ParachainId.AMPLITUDE)
      return amplitudeReview
    else
      return bifrostReview
  }, [amplitudeReview, bifrostReview, chainId, wagmiReview])
}
