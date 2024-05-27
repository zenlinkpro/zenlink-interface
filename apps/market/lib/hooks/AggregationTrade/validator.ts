import { PoolType } from '@zenlink-interface/amm'
import { z } from 'zod'

const tokenValidator = z.object({
  address: z.string().optional(),
  chainId: z.number(),
  decimals: z.number().optional(),
  isNative: z.boolean().optional(),
  isToken: z.boolean().optional(),
  name: z.string(),
  symbol: z.string(),
  tokenId: z.string().optional(),
})

export const tradeValidator = z.object({
  bestRoute: z.object({
    amountIn: z.number(),
    amountInBN: z.string(),
    amountOut: z.number(),
    amountOutBN: z.string(),
    fromToken: tokenValidator,
    gasSpent: z.number(),
    legs: z
      .array(
        z.object({
          absolutePortion: z.number(),
          assumedAmountIn: z.number(),
          assumedAmountOut: z.number(),
          poolAddress: z.string(),
          poolFee: z.number(),
          poolId: z.string(),
          poolType: z.nativeEnum(PoolType),
          protocol: z.string().optional(),
          swapPortion: z.number(),
          tokenFrom: tokenValidator,
          tokenTo: tokenValidator,
        }),
      )
      .optional(),
    priceImpact: z.number(),
    primaryPrice: z.number(),
    status: z.string(),
    swapPrice: z.number(),
    toToken: tokenValidator,
    totalAmountOut: z.number(),
    totalAmountOutBN: z.string(),
  }),
  executorAddress: z.optional(z.string()),
  routeHumanString: z.string(),
  routeParams: z.optional(
    z.object({
      amountIn: z.string(),
      amountOutMin: z.string(),
      routeCode: z.string(),
      to: z.string(),
      tokenIn: z.string(),
      tokenOut: z.string(),
    }),
  ),
  routerAddress: z.optional(z.string()),
})
