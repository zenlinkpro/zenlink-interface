import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ParachainId } from '@zenlink-interface/chain'
import { z } from 'zod'
import {
  Router,
  getAggregationExecutorAddressForChainId,
  getAggregationRouterAddressForChainId,
} from '@zenlink-interface/smart-router'
import { BigNumber } from 'ethers'
import { Native } from '@zenlink-interface/currency'
import { getToken } from './tokens'
import { convertChainId, getDataFetcher } from './config'

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

export function getFeeSettlementAddressForChainId(chainId: ParachainId) {
  switch (chainId) {
    case ParachainId.MOONBEAM:
      return '0x8C7d87A2bAb7b48C4767983483E339eC0C8785a8'
    default:
      throw new Error(`Unsupported aggregation router network for ${chainId}`)
  }
}

export default async (request: VercelRequest, response: VercelResponse) => {
  const {
    chainId: _chainId,
    fromTokenId,
    toTokenId,
    amount,
    gasPrice,
    to,
    priceImpact,
  } = querySchema.parse(request.query)

  const chainId = convertChainId(_chainId)
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
        protocol: poolCodesMap.get(l.poolId)?.poolName,
      })),
    },
    routerAddress: getAggregationRouterAddressForChainId(chainId),
    executorAddress: getAggregationExecutorAddressForChainId(chainId),
    routeParams: to
      ? Router.aggregationRouterParams(
        dataFetcher,
        bestRoute,
        fromToken,
        toToken,
        to,
        getAggregationExecutorAddressForChainId(chainId),
        getFeeSettlementAddressForChainId(chainId),
        priceImpact,
      )
      : undefined,
  })
}
