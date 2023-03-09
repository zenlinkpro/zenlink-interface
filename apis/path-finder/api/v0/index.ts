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
  toTokenId: z.string().default('Native'),
  gasPrice: z.coerce.number().int().gte(1),
  amount: z.coerce.string(),
  to: z.optional(z.string()),
  priceImpact: z.optional(z.coerce.number()),
})

export function getRouteProcessorAddressForChainId(chainId: ParachainId) {
  switch (chainId) {
    case ParachainId.ASTAR:
      return '0x41479dBb983b85587bfEDd11D1Fcfe6ACe138AE1'
    default:
      throw new Error(`Unsupported route processor network for ${chainId}`)
  }
}

export function getFeeSettlementAddressForChainId(chainId: ParachainId) {
  switch (chainId) {
    case ParachainId.ASTAR:
      return '0xAFCCA0f68e0883b797c71525377DE46B2E65AB28'
    default:
      throw new Error(`Unsupported route processor network for ${chainId}`)
  }
}

export default async (request: VercelRequest, response: VercelResponse) => {
  const {
    chainId,
    fromTokenId,
    toTokenId,
    amount,
    gasPrice,
    to,
    priceImpact,
  } = querySchema.parse(request.query)

  const dataFetcher = getDataFetcher(chainId)

  if (!dataFetcher)
    return response.status(400).json({ message: `Unsupported chainId ${chainId}` })

  const [fromToken, toToken] = await Promise.all([
    getToken(chainId, fromTokenId),
    getToken(chainId, toTokenId),
  ])

  if (!fromToken || !toToken)
    return response.status(400).json({ message: `Token not supported ${fromTokenId} or ${toTokenId}` })

  dataFetcher.startDataFetching()
  await dataFetcher.fetchPoolsForToken(fromToken, toToken)

  const router = new Router(
    dataFetcher,
    fromToken,
    BigNumber.from(amount),
    toToken,
    gasPrice ?? 30e9,
  )

  router.startRouting(() => {
    router.stopRouting()
    dataFetcher.stopDataFetching()
  })

  const bestRoute = router.getBestRoute()

  if (!bestRoute)
    return response.status(400).json({ message: 'Cannot find route, please try again.' })

  const poolCodesMap = dataFetcher.getCurrentPoolCodeMap()

  return response.status(200).json({
    routeHumanString: Router.routeToHumanString(dataFetcher, bestRoute, fromToken, toToken),
    bestRoute: {
      status: bestRoute.status,
      fromToken: bestRoute.fromToken.address === '' ? Native.onChain(chainId) : bestRoute.fromToken,
      toToken: bestRoute.toToken.address === '' ? Native.onChain(chainId) : bestRoute.toToken,
      primaryPrice: bestRoute.primaryPrice,
      swapPrice: bestRoute.swapPrice,
      amountIn: bestRoute.amountIn,
      amountInBN: bestRoute.amountInBN.toString(),
      amountOut: bestRoute.amountOut,
      amountOutBN: bestRoute.amountOutBN.toString(),
      priceImpact: bestRoute.priceImpact,
      totalAmountOut: bestRoute.totalAmountOut,
      totalAmountOutBN: bestRoute.totalAmountOutBN.toString(),
      gasSpent: bestRoute.gasSpent,
      legs: bestRoute.legs.map(l => ({
        ...l,
        protocol: poolCodesMap.get(l.poolAddress)?.poolName,
      })),
    },
    routeParams: to
      ? Router.routeProcessorParams(
        dataFetcher,
        bestRoute,
        fromToken,
        toToken,
        to,
        getRouteProcessorAddressForChainId(chainId),
        getFeeSettlementAddressForChainId(chainId),
        priceImpact,
      )
      : undefined,
  })
}
