/* eslint-disable no-console */
import { Router } from '@zenlink-interface/smart-router'
import { BigNumber } from 'ethers'
import { ParachainId } from '@zenlink-interface/chain'
import { z } from 'zod'
import { Native } from '@zenlink-interface/currency'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getToken } from './tokens'
import { getDataFetcher } from './config'

const querySchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ParachainId.ASTAR),
  fromTokenId: z.string().default('Native'),
  toTokenId: z.string().default('ZLK'),
  gasPrice: z.coerce.number().int().gte(1),
  amount: z.coerce.string(),
  to: z.optional(z.string()),
})

export default async (request: VercelRequest, response: VercelResponse) => {
  console.time('time')
  const {
    chainId,
    fromTokenId,
    toTokenId,
    amount,
    gasPrice,
  } = querySchema.parse(request.query)

  const dataFetcher = getDataFetcher(chainId)

  if (!dataFetcher)
    return response.status(400).json({ message: `Unsupported chainId ${chainId}` })

  const fromToken = getToken(chainId, fromTokenId)
  const toToken = getToken(chainId, toTokenId)

  if (!fromToken || !toToken)
    return response.status(400).json({ message: `Token not supported ${fromTokenId} or ${toTokenId}` })

  dataFetcher.startDataFetching()
  dataFetcher.fetchPoolsForToken(fromToken, toToken)

  const router = new Router(
    dataFetcher,
    fromToken,
    BigNumber.from(amount),
    toToken,
    gasPrice ?? 30e9,
  )

  await new Promise<void>((resolve) => {
    router.startRouting(() => {
      resolve()
    })
  })
  router.stopRouting()

  const bestRoute = router.getBestRoute()

  console.timeEnd('time')

  return response.status(200).json({
    getCurrentRouteHumanString: bestRoute
      ? Router.routeToHumanString(dataFetcher, bestRoute, fromToken, toToken)
      : '',
    getBestRoute: {
      status: bestRoute?.status,
      fromToken: bestRoute?.fromToken?.address === '' ? Native.onChain(chainId) : bestRoute?.fromToken,
      toToken: bestRoute?.toToken?.address === '' ? Native.onChain(chainId) : bestRoute?.toToken,
      primaryPrice: bestRoute?.primaryPrice,
      swapPrice: bestRoute?.swapPrice,
      amountIn: bestRoute?.amountIn,
      amountInBN: bestRoute?.amountInBN.toString(),
      amountOut: bestRoute?.amountOut,
      amountOutBN: bestRoute?.amountOutBN.toString(),
      priceImpact: bestRoute?.priceImpact,
      totalAmountOut: bestRoute?.totalAmountOut,
      totalAmountOutBN: bestRoute?.totalAmountOutBN.toString(),
      gasSpent: bestRoute?.gasSpent,
      legs: bestRoute?.legs,
    },
  })
}

