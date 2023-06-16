import type { Pair } from '@zenlink-interface/amm'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Type } from '@zenlink-interface/currency'
import type { Percent } from '@zenlink-interface/math'
import { useRemoveLiquidityStandardReview as useWagmiRemoveLiquidityStandardReview } from '@zenlink-interface/wagmi'
import { useRemoveLiquidityStandardReview as useBifrostRemoveLiquidityStandardReview } from '@zenlink-interface/parachains-manta'
import { useMemo } from 'react'
import { isEvmNetwork } from '../config'

interface UseRemoveLiquidityStandardReviewParams {
  chainId: ParachainId
  token0: Type
  token1: Type
  minAmount0: Amount<Type> | undefined
  minAmount1: Amount<Type> | undefined
  pool: Pair | null
  percentToRemove: Percent
  balance: Amount<Type> | undefined
}

type UseRemoveLiquidityStandardReview = (params: UseRemoveLiquidityStandardReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useRemoveLiquidityStandardReview: UseRemoveLiquidityStandardReview = ({
  chainId,
  ...params
}) => {
  const wagmiRemoveLiquidityStandardReview = useWagmiRemoveLiquidityStandardReview({
    chainId,
    ...params,
  })

  const bifrostRemoveLiquidityStandardReview = useBifrostRemoveLiquidityStandardReview({
    chainId,
    ...params,
  })

  return useMemo(() => {
    if (chainId && isEvmNetwork(chainId))
      return wagmiRemoveLiquidityStandardReview

    return bifrostRemoveLiquidityStandardReview
  }, [bifrostRemoveLiquidityStandardReview, chainId, wagmiRemoveLiquidityStandardReview])
}
