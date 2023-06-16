import type { AggregatorTrade, Trade } from '@zenlink-interface/amm'
import { TradeVersion } from '@zenlink-interface/amm'
import type { Dispatch, SetStateAction } from 'react'
import { useMemo } from 'react'
import { useSwapReview as useWagmiSwapReview } from '@zenlink-interface/wagmi'
import { useSwapReview as useBifrostSwapReview } from '@zenlink-interface/parachains-manta'
import { EVM_NETWORKS, isEvmNetwork } from '../config'

interface UseSwapReviewParams {
  chainId: number | undefined
  trade: Trade | AggregatorTrade | undefined
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
  trade,
  ...params
}) => {
  const wagmiSwapReview = useWagmiSwapReview({
    chainId,
    trade,
    enableNetworks: EVM_NETWORKS,
    ...params,
  })

  const bifrostSwapReview = useBifrostSwapReview({
    chainId,
    trade: trade?.version === TradeVersion.LEGACY ? trade : undefined,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiSwapReview

    return bifrostSwapReview
  }, [bifrostSwapReview, chainId, wagmiSwapReview])
}
