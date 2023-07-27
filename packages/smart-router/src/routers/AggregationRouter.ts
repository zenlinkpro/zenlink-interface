import type { ParachainId } from '@zenlink-interface/chain'
import { RouteStatus } from '@zenlink-interface/amm'
import type { BaseToken, RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import { PoolCode } from '../entities'
import { HEXer } from '../HEXer'
import { NATIVE_ADDRESS } from './Router'

export class AggregationRouter {
  public readonly aggregationExecutorAddress: string
  public readonly feeSettlementAddress: string
  public readonly chainId: ParachainId
  public readonly pools: Map<string, PoolCode>
  public tokenOutputLegs: Map<string, RouteLeg[]>

  public constructor(
    aggregationExecutorAddress: string,
    feeSettlementAddress: string,
    chainId: ParachainId,
    pools: Map<string, PoolCode>,
  ) {
    this.aggregationExecutorAddress = aggregationExecutorAddress
    this.feeSettlementAddress = feeSettlementAddress
    this.chainId = chainId
    this.pools = pools
    this.tokenOutputLegs = new Map()
  }

  public getRouteCode(route: SplitMultiRoute): string {
    // 0. Check for no route
    if (route.status === RouteStatus.NoWay || !route.legs.length)
      return ''

    this.calcTokenOutputLegs(route)
    let res = '0x'

    const processedTokens = new Set<string | undefined>()
    route.legs.forEach((l, i) => {
      const token = l.tokenFrom
      if (processedTokens.has(token.tokenId))
        return
      processedTokens.add(token.tokenId)

      if (i > 0) {
        if (token.address === '')
          throw new Error(`unexpected native inside the route: ${token.symbol}`)
        res += this.processERC20Code(token, route)
      }
      else {
        if (token.address === '')
          res += this.processNativeCode(token, route)
        else res += this.processERC20Code(token, route)
      }
    })

    return res
  }

  public processNativeCode(token: BaseToken, route: SplitMultiRoute): string {
    const outputLegs = this.tokenOutputLegs.get(token.tokenId!)
    if (!outputLegs || outputLegs.length !== 1)
      throw new Error(`Not 1 output pool for native token: ${outputLegs?.length}`)

    const hex = new HEXer()
      .address(NATIVE_ADDRESS)
      .uint8(outputLegs.length)

    outputLegs.forEach((l) => {
      hex.share16(l.swapPortion).uint8(1).hexData(this.swapCode(l, route))
    })
    return hex.toString()
  }

  public processERC20Code(token: BaseToken, route: SplitMultiRoute): string {
    const outputLegs = this.tokenOutputLegs.get(token.tokenId as string)
    if (!outputLegs || !outputLegs.length)
      throw new Error(`No output legs for token ${token.symbol}`)

    const hex = new HEXer()
      .address(token.address!)
      .uint8(outputLegs.length)

    outputLegs.forEach((l) => {
      hex.share16(l.swapPortion)
        .uint8(l.tokenTo.address === '' ? 1 : 2)
        .hexData(this.swapCode(l, route))
    })
    return hex.toString()
  }

  public swapCode(leg: RouteLeg, route: SplitMultiRoute): string {
    const pc = this.getPoolCode(leg)
    const to = this.getPoolOutputAddress(leg, route)
    return pc.getSwapCodeForAggregationRouter(leg, route, to) // , this.presendedLegs.has(leg))
  }

  public getPoolOutputAddress(l: RouteLeg, route: SplitMultiRoute): string {
    let outAddress: string
    const outputDistribution = this.tokenOutputLegs.get(l.tokenTo.tokenId!) || []
    if (!outputDistribution.length) {
      outAddress = this.feeSettlementAddress
    }
    else if (outputDistribution.length === 1) {
      outAddress = this.getPoolCode(outputDistribution[0]).getProtocolExecutorStartPoint(l, route)
      if (outAddress === PoolCode.ProtocolExecutorAddress)
        outAddress = this.aggregationExecutorAddress
    }
    else {
      outAddress = this.aggregationExecutorAddress
    }
    return outAddress
  }

  public getPoolCode(l: RouteLeg): PoolCode {
    const pc = this.pools.get(l.poolId)
    if (pc === undefined)
      throw new Error(`unknown pool: ${l.poolId}`)

    return pc
  }

  public calcTokenOutputLegs(route: SplitMultiRoute) {
    const res = new Map<string, RouteLeg[]>()

    route.legs.forEach((l) => {
      const tokenId = l.tokenFrom.tokenId?.toString()
      if (tokenId === undefined) {
        throw new Error('Unseted tokenId')
      }
      else {
        const legsOutput = res.get(tokenId) || []
        legsOutput.push(l)
        res.set(tokenId, legsOutput)
      }
    })

    this.tokenOutputLegs = res
  }
}

export function getAggregationRouterCode(
  route: SplitMultiRoute,
  aggregationExecutorAddress: string,
  feeSettlementAddress: string,
  pools: Map<string, PoolCode>,
): string {
  const rp = new AggregationRouter(
    aggregationExecutorAddress,
    feeSettlementAddress,
    route.fromToken.chainId as ParachainId,
    pools,
  )
  return rp.getRouteCode(route)
}
