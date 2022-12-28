import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Token } from '@zenlink-interface/currency'
import type { CalculatedStbaleSwapLiquidity, StableSwapWithBase } from '@zenlink-interface/wagmi'
import type { Dispatch, SetStateAction } from 'react'
import { useMemo } from 'react'
import { useAddLiquidityStableReview as useWagmiAddLiquidityStableReview } from '@zenlink-interface/wagmi'
import { isEvmNetwork } from '../config'

interface UseAddLiquidityStableReviewParams {
  chainId: ParachainId
  swap: StableSwapWithBase | undefined
  poolName: string | undefined
  inputs: Amount<Token>[]
  useBase: boolean
  liquidity: CalculatedStbaleSwapLiquidity
  setOpen: Dispatch<SetStateAction<boolean>>
}

type UseAddLiquidityStableReview = (params: UseAddLiquidityStableReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useAddLiquidityStableReview: UseAddLiquidityStableReview = ({
  chainId,
  ...props
}) => {
  const wagmiAddLiquidityStableReview = useWagmiAddLiquidityStableReview({
    chainId,
    ...props,
  })

  return useMemo(() => {
    if (isEvmNetwork(chainId))
      return wagmiAddLiquidityStableReview

    return {
      isWritePending: false,
      sendTransaction: undefined,
      routerAddress: undefined,
    }
  }, [chainId, wagmiAddLiquidityStableReview])
}

