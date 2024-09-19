import type { BigNumber } from '@ethersproject/bignumber'
import type { Type } from '@zenlink-interface/currency'
import type { DataFetcher } from '../fetchers'
import { RouteStatus } from '@zenlink-interface/amm'
import { LiquidityProviders } from '../liquidity-providers'
import { Router } from './Router'

export const PreferrableLiquidityProviders: LiquidityProviders[] = [
  LiquidityProviders.Zenlink,
  LiquidityProviders.ArthSwapV2,
]

export function findSpecialRoute(
  dataFetcher: DataFetcher,
  fromToken: Type,
  amountIn: BigNumber,
  toToken: Type,
  gasPrice: number,
  maxPriceImpact = 1, // 1%
) {
  // Find preferrable route
  const preferrableRoute = Router.findBestRoute(
    dataFetcher,
    fromToken,
    amountIn,
    toToken,
    gasPrice,
    PreferrableLiquidityProviders,
  )
  // If the route is successful and the price impact is less than maxPriceImpact, then return the route
  if (
    preferrableRoute.status === RouteStatus.Success
    && preferrableRoute.priceImpact !== undefined
    && preferrableRoute.priceImpact < maxPriceImpact / 100
  ) {
    return preferrableRoute
  }

  // Otherwise, find the route using all possible liquidity providers
  return Router.findBestRoute(dataFetcher, fromToken, amountIn, toToken, gasPrice)
}
