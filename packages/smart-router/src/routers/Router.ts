import type { BigNumber } from '@ethersproject/bignumber'
import type { Type } from '@zenlink-interface/currency'
import { Token, WNATIVE } from '@zenlink-interface/currency'
import type { BasePool, BaseToken, MultiRoute, NetworkInfo } from '../entities'
import { RouteStatus } from '../entities'
import type { DataFetcher } from '../fetchers'
import type { LiquidityProviders } from '../liquidity-providers'
import { getBigNumber } from '../util'
import { findMultiRouteExactIn } from './MultiRouter'
import { getRouteProcessorCode } from './RouteProcessor'

type RouteCallBack = (r: MultiRoute) => void
export type PoolFilter = (list: BasePool) => boolean
export const NATIVE_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

function TokenToBaseToken(t: Type): BaseToken {
  if (t instanceof Token)
    return t as BaseToken
  const nativeBaseToken: BaseToken = {
    address: '',
    name: t.name,
    symbol: t.symbol,
    chainId: t.chainId,
  }
  return nativeBaseToken
}

export class Router {
  public dataFetcher: DataFetcher
  public fromToken: Type
  public amountIn: BigNumber
  public toToken: Type
  public gasPrice: number
  public providers?: LiquidityProviders[] | undefined // all providers if undefined
  public minUpdateDelay: number
  public poolFilter?: PoolFilter

  public dataFetcherPreviousState = 0
  public routeCallBack?: RouteCallBack
  public currentBestRoute?: MultiRoute | undefined

  public timer?: NodeJS.Timeout // timer from setInterval

  public constructor(
    dataFetcher: DataFetcher,
    fromToken: Type,
    amountIn: BigNumber,
    toToken: Type,
    gasPrice: number,
    providers?: LiquidityProviders[], // all providers if undefined
    poolFilter?: PoolFilter,
    minUpdateDelay = 1000, // Minimal delay between routing update
  ) {
    this.dataFetcher = dataFetcher
    this.fromToken = fromToken
    this.amountIn = amountIn
    this.toToken = toToken
    this.gasPrice = gasPrice
    this.providers = providers
    this.minUpdateDelay = minUpdateDelay
    this.poolFilter = poolFilter
  }

  public startRouting(p: RouteCallBack) {
    this.stopRouting()
    this.routeCallBack = p
    this.currentBestRoute = undefined
    this.dataFetcherPreviousState = 0
    this._checkRouteUpdate() // Maybe a route is ready
    this.timer = setInterval(() => this._checkRouteUpdate(), this.minUpdateDelay)
  }

  // To stop gather pool data and routing calculation
  public stopRouting() {
    if (this.timer)
      clearInterval(this.timer)
    this.timer = undefined
  }

  public getBestRoute(): MultiRoute | undefined {
    return this.currentBestRoute
  }

  private _checkRouteUpdate() {
    const currentDataFetcherStateId = this.dataFetcher.getCurrentPoolStateId(this.providers)
    if (this.dataFetcherPreviousState !== currentDataFetcherStateId) {
      this.dataFetcherPreviousState = currentDataFetcherStateId

      const networks: NetworkInfo[] = [
        {
          chainId: this.dataFetcher.chainId,
          baseToken: WNATIVE[this.dataFetcher.chainId] as BaseToken,
          gasPrice: this.gasPrice as number,
        },
      ]

      let pools = this.dataFetcher.getCurrentPoolCodeList(this.providers).map(pc => pc.pool)
      if (this.poolFilter)
        pools = pools.filter(this.poolFilter)

      const route = findMultiRouteExactIn(
        TokenToBaseToken(this.fromToken),
        TokenToBaseToken(this.toToken),
        this.amountIn,
        pools,
        networks,
        this.gasPrice,
      )

      if (route.status !== RouteStatus.NoWay) {
        this.currentBestRoute = route
        if (this.routeCallBack)
          this.routeCallBack(route)
      }
    }
  }

  static findBestRoute(
    dataFetcher: DataFetcher,
    fromToken: Type,
    amountIn: BigNumber,
    toToken: Type,
    gasPrice: number,
    providers?: LiquidityProviders[], // all providers if undefined
    poolFilter?: PoolFilter,
  ): MultiRoute {
    const networks: NetworkInfo[] = [
      {
        chainId: dataFetcher.chainId,
        baseToken: WNATIVE[dataFetcher.chainId] as BaseToken,
        gasPrice: gasPrice as number,
      },
    ]

    let pools = dataFetcher.getCurrentPoolCodeList(providers).map(pc => pc.pool)
    if (poolFilter)
      pools = pools.filter(poolFilter)

    return findMultiRouteExactIn(
      TokenToBaseToken(fromToken),
      TokenToBaseToken(toToken),
      amountIn,
      pools,
      networks,
      gasPrice,
    )
  }

  static routeProcessorParams(
    dataFetcher: DataFetcher,
    route: MultiRoute,
    fromToken: Type,
    toToken: Type,
    to: string,
    routeProcessorAddress: string,
    feeSettlementAddress: string,
    maxPriceImpact = 0.005,
  ) {
    const tokenIn = fromToken instanceof Token
      ? fromToken.address
      : NATIVE_ADDRESS
    const tokenOut = toToken instanceof Token
      ? toToken.address
      : NATIVE_ADDRESS
    const amountOutMin = route.amountOutBN
      .mul(getBigNumber((1 - maxPriceImpact) * 1_000_000))
      .div(1_000_000)

    return {
      tokenIn,
      amountIn: route.amountInBN.toString(),
      tokenOut,
      amountOutMin: amountOutMin.toString(),
      to,
      routeCode: getRouteProcessorCode(
        route,
        routeProcessorAddress,
        feeSettlementAddress,
        dataFetcher.getCurrentPoolCodeMap(),
      ),
      value: fromToken instanceof Token ? undefined : route.amountInBN.toString(),
    }
  }

  static routeToHumanString(
    dataFetcher: DataFetcher,
    route: MultiRoute,
    fromToken: Type,
    toToken: Type,
    shiftPrimary = '',
    shiftSub = '    ',
  ): string {
    const poolCodesMap = dataFetcher.getCurrentPoolCodeMap()
    let res = ''
    res += `${shiftPrimary}Route Status: ${route.status}\n`
    res += `${shiftPrimary}Input: ${route.amountIn / 10 ** fromToken.decimals} ${fromToken.symbol}\n`
    route.legs.forEach((l, i) => {
      res
        += `${shiftSub
        }${i + 1}. ${l.tokenFrom.symbol} ${Math.round(l.absolutePortion * 100)}%`
        + ` -> [${poolCodesMap.get(l.poolAddress)?.poolName}] -> ${l.tokenTo.symbol}\n`
    })
    const output = parseInt(route.amountOutBN.toString()) / 10 ** toToken.decimals
    res += `${shiftPrimary}Output: ${output} ${route.toToken.symbol}`

    return res
  }
}
