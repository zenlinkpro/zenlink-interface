import { z } from 'zod'

const tokenValidator = z.object({
  chainId: z.number(),
  decimals: z.number().optional(),
  symbol: z.string(),
  name: z.string(),
  isNative: z.boolean().optional(),
  isToken: z.boolean().optional(),
  address: z.string().optional(),
  tokenId: z.string().optional(),
})

export const tradeValidator = z.object({
  routeHumanString: z.string(),
  bestRoute: z.object({
    status: z.string(),
    fromToken: tokenValidator,
    toToken: tokenValidator,
    primaryPrice: z.number(),
    swapPrice: z.number(),
    priceImpact: z.number(),
    amountIn: z.number(),
    amountInBN: z.string(),
    amountOut: z.number(),
    gasSpent: z.number(),
    amountOutBN: z.string(),
    totalAmountOut: z.number(),
    totalAmountOutBN: z.string(),
    legs: z
      .array(
        z.object({
          poolAddress: z.string(),
          poolType: z.enum(['Stable', 'Standard', 'Unknown']),
          poolFee: z.number(),
          tokenFrom: tokenValidator,
          tokenTo: tokenValidator,
          assumedAmountIn: z.number(),
          assumedAmountOut: z.number(),
          swapPortion: z.number(),
          absolutePortion: z.number(),
        }),
      )
      .optional(),
  }),
  routeParams: z.optional(
    z.object({
      amountIn: z.string(),
      amountOutMin: z.string(),
      to: z.string(),
      tokenIn: z.string(),
      tokenOut: z.string(),
      routeCode: z.string(),
    }),
  ),
})
