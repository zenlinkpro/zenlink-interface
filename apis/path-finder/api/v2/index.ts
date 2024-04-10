import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ParachainId } from '@zenlink-interface/chain'
import { z } from 'zod'
import type { LiquidityProviders } from '@zenlink-interface/smart-router'
import {
  Router,
  getAggregationExecutorAddressForChainId,
  getAggregationRouterAddressForChainId,
} from '@zenlink-interface/smart-router'
import { BigNumber } from 'ethers'
import { Native } from '@zenlink-interface/currency'
import redis from '../../lib/redis'
import { getToken } from './tokens'
import { MAX_REQUESTS_PER_MIN, convertChainId, getClient, getDataFetcher } from './config'

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
  liquidityProviders: z.optional(z.string()),
})

export function getFeeSettlementAddressForChainId(chainId: ParachainId) {
  switch (chainId) {
    case ParachainId.MOONBEAM:
      return '0x8C7d87A2bAb7b48C4767983483E339eC0C8785a8'
    case ParachainId.SCROLL_ALPHA:
      return '0x4A7Dc8a7f62c46353dF2529c0789cF83C0e0e016'
    case ParachainId.SCROLL:
      return '0x7F12564eca712fa59b0EEdfE56EABC8b53a7B0cd'
    case ParachainId.BASE:
      return '0x7F12564eca712fa59b0EEdfE56EABC8b53a7B0cd'
    case ParachainId.ASTAR:
      return '0x85CbA73Cf58b5CA8FA20AcDB220F92ce350936C0'
    default:
      throw new Error(`Unsupported aggregation router network for ${chainId}`)
  }
}

export default async (request: VercelRequest, response: VercelResponse) => {
  const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress

  if (ip) {
    const key = `path_finder_v2_rate_limit:${ip}`
    const currentCount = (await redis.get(key) || 0).toString()
    if (Number.parseInt(currentCount, 10) >= MAX_REQUESTS_PER_MIN) {
      response.status(429).send('Too many requests. Please try again later.')
      return
    }
    await redis.multi()
      .set(key, Number.parseInt(currentCount, 10) + 1, 'EX', 60)
      .exec()
  }

  const {
    chainId: _chainId,
    fromTokenId,
    toTokenId,
    amount,
    gasPrice,
    to,
    priceImpact,
    liquidityProviders,
  } = querySchema.parse(request.query)

  const chainId = convertChainId(_chainId)
  const client = getClient(chainId)
  const dataFetcher = getDataFetcher(chainId)

  if (!dataFetcher || !client)
    return response.status(400).json({ message: `Unsupported chainId ${chainId}` })

  const [fromToken, toToken] = await Promise.all([
    getToken(chainId, fromTokenId),
    getToken(chainId, toTokenId),
  ])

  if (!fromToken || !toToken)
    return response.status(400).json({ message: `Token not supported ${fromTokenId} or ${toTokenId}` })

  const providers = liquidityProviders
    ? JSON.parse(liquidityProviders) as LiquidityProviders[]
    : undefined
  dataFetcher.startDataFetching(providers)
  await dataFetcher.fetchPoolsForToken(fromToken, toToken)

  const currentGasPrice = await client.getGasPrice()
  const router = new Router(
    dataFetcher,
    fromToken,
    BigNumber.from(amount),
    toToken,
    Number(currentGasPrice) ?? gasPrice ?? 30e9,
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
