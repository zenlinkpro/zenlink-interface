import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Type } from '@zenlink-interface/currency'
import { useWithdrawFarmingReview as useWagmiWithdrawFarmingReview } from '@zenlink-interface/wagmi'
import { useWithdrawFarmingReview as useBifrostWithdrawFarmingReview } from '@zenlink-interface/parachains-manta'
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

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiReview

    return bifrostReview
  }, [bifrostReview, chainId, wagmiReview])
}
