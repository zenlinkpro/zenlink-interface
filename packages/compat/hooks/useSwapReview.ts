import type { Trade } from '@zenlink-interface/amm'
import type { Dispatch, SetStateAction } from 'react'
import { useMemo } from 'react'
import { useSwapReview as useWagmiSwapReview } from '@zenlink-interface/wagmi'
import { useSwapReview as useBifrostSwapReview } from '@zenlink-interface/parachains-bifrost'
import { EVM_NETWORKS, isEvmNetwork } from '../config'

interface UseSwapReviewParams {
  chainId: number | undefined
  trade: Trade | undefined
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string | undefined>>
  onSuccess(): void
}

type UseSwapReview = (params: UseSwapReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | (() => Promise<void>) | undefined
  routerAddress: string | undefined
}

export const useSwapReview: UseSwapReview = ({
  chainId,
  ...params
}) => {
  const wagmiSwapReview = useWagmiSwapReview({
    chainId,
    ...params,
    enableNetworks: EVM_NETWORKS,
  })

  const bifrostSwapReview = useBifrostSwapReview({
    chainId,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiSwapReview

    return bifrostSwapReview
  }, [bifrostSwapReview, chainId, wagmiSwapReview])
}
