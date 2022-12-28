import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Token, Type } from '@zenlink-interface/currency'
import type { CalculatedStbaleSwapLiquidity, StableSwapWithBase } from '@zenlink-interface/wagmi'
import { useRemoveLiquidityStableReview as useWagmiRemoveLiquidityStableReview } from '@zenlink-interface/wagmi'
import { useMemo } from 'react'
import { isEvmNetwork } from '../config'

interface UseRemoveLiquidityStableReviewParams {
  chainId: ParachainId
  swap: StableSwapWithBase | undefined
  poolName: string | undefined
  minReviewedAmounts: Amount<Token>[]
  liquidity: CalculatedStbaleSwapLiquidity
  balance: Amount<Type> | undefined
  amountToRemove: Amount<Type> | undefined
  useBase: boolean
}

type UseRemoveLiquidityStableReview = (params: UseRemoveLiquidityStableReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useRemoveLiquidityStableReview: UseRemoveLiquidityStableReview = ({
  chainId,
  ...props
}) => {
  const wagmiRemoveLiquidityStableReview = useWagmiRemoveLiquidityStableReview({
    chainId,
    ...props,
  })

  return useMemo(() => {
    if (isEvmNetwork(chainId))
      return wagmiRemoveLiquidityStableReview

    return {
      isWritePending: false,
      sendTransaction: undefined,
      routerAddress: undefined,
    }
  }, [chainId, wagmiRemoveLiquidityStableReview])
}
