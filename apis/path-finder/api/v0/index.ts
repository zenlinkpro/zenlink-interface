import { Router } from '@zenlink-interface/smart-router'
import { BigNumber } from 'ethers'
import { ParachainId } from '@zenlink-interface/chain'
import { z } from 'zod'
import { Native } from '@zenlink-interface/currency'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getToken } from './tokens'
import { V2_CHAINS, getDataFetcher } from './config'

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

export function getRouteProcessor2AddressForChainId(chainId: ParachainId) {
  switch (chainId) {
    case ParachainId.ARBITRUM_ONE:
      return '0x6A6FC6B4d33E27087410Ff5d5F15995dabDF4Ce7'
    case ParachainId.MOONBEAM:
      return '0xfb39167FE3b148ADd082ca62FBE9413CF5Fa101f'
    default:
      throw new Error(`Unsupported route processor network for ${chainId}`)
  }
}

export function getFeeSettlementAddressForChainId(chainId: ParachainId) {
  switch (chainId) {
    case ParachainId.ASTAR:
      return '0x24d20B28a0B5E2B5B724f9b6C60E32E6B505Eb35'
    case ParachainId.ARBITRUM_ONE:
      return '0xAFCCA0f68e0883b797c71525377DE46B2E65AB28'
    case ParachainId.MOONBEAM:
      return '0xb3c43F5A4ab0A52b180a5350f7F5c47e582CDdA9'
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
        protocol: poolCodesMap.get(l.poolId)?.poolName,
      })),
    },
    routeParams: to
      ? V2_CHAINS.includes(chainId)
        ? Router.routeProcessorParams2(
          dataFetcher,
          bestRoute,
          fromToken,
          toToken,
          to,
          getRouteProcessor2AddressForChainId(chainId),
          getFeeSettlementAddressForChainId(chainId),
          priceImpact,
        )
        : Router.routeProcessorParams(
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
