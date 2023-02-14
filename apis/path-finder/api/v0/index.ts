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
  toTokenId: z.string().default('Native'),
  gasPrice: z.coerce.number().int().gte(1),
  amount: z.coerce.string(),
  to: z.optional(z.string()),
})

export function getRouteProcessorAddressForChainId(chainId: ParachainId) {
  switch (chainId) {
    case ParachainId.ASTAR:
      return '0x2Bd0F65F0a67c0b7Eb35414D4459Fd98a323a240'
    default:
      throw new Error(`Unsupported route processor network for ${chainId}`)
  }
}

const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

class Waiter {
  resolved = false

  async wait() {
    while (!this.resolved)
      await delay(500)
  }

  resolve() {
    this.resolved = true
  }
}

export default async (request: VercelRequest, response: VercelResponse) => {
  console.time('time')
  const {
    chainId,
    fromTokenId,
    toTokenId,
    amount,
    gasPrice,
    to,
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
  const waiter = new Waiter()

  const router = new Router(
    dataFetcher,
    fromToken,
    BigNumber.from(amount),
    toToken,
    gasPrice ?? 30e9,
  )

  router.startRouting(() => {
    waiter.resolve()
  })

  await waiter.wait()

  router.stopRouting()
  dataFetcher.stopDataFetching()

  const bestRoute = router.getBestRoute()

  console.timeEnd('time')

  if (!bestRoute)
    return response.status(400).json({ message: 'Cannot find route, please try again.' })

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
      legs: bestRoute.legs,
    },
    routeParams: to
      ? Router.routeProcessorParams(
        dataFetcher,
        bestRoute,
        fromToken,
        toToken,
        to,
        getRouteProcessorAddressForChainId(chainId),
      )
      : undefined,
  })
}
