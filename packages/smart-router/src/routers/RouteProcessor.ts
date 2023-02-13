import { BigNumber } from '@ethersproject/bignumber'
import invariant from 'tiny-invariant'
import type { BaseToken, RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import { RouteStatus } from '@zenlink-interface/amm'
import { PoolCode } from '../entities'
import { HEXer } from '../HEXer'
import { getBigNumber } from '../util'
import { CommandCode } from '../CommandCode'

function last<T>(arr: T[]): T {
  return arr[arr.length - 1]
}

export class RouteProcessor {
  public readonly routeProcessorAddress: string
  public readonly pools: Map<string, PoolCode>
  public tokenOutputLegs: Map<string, RouteLeg[]>

  public constructor(routeProcessorAddress: string, pools: Map<string, PoolCode>) {
    this.routeProcessorAddress = routeProcessorAddress
    this.pools = pools
    this.tokenOutputLegs = new Map()
  }

  public getRouteCode(route: SplitMultiRoute, toAddress: string): string {
    // 0. Check for no route
    if (route.status === RouteStatus.NoWay || !route.legs.length)
      return ''

    if (route.legs.length === 1 && route.fromToken.address === '') {
      // very special case
      return this.getCodeForsimpleWrap(route, toAddress)
    }

    this.setTokenOutputLegs(route)
    let res = '0x'

    // 1. Initial distribution
    const [initialCode, exactAmount] = this.getCodeDistributeInitial(route)
    res += initialCode

    const distributedTokens = new Set([route.fromToken.tokenId])
    route.legs.forEach((l, i) => {
      if (i === 0 && l.tokenFrom.address === '') {
        // Native - processed by codeDistributeInitial
        distributedTokens.add(l.tokenTo.tokenId)
        return
      }

      // 2. Transfer tokens from the routeProcessor contract to the pool if it is neccessary
      if (!distributedTokens.has(l.tokenFrom.tokenId)) {
        res += this.getCodeDistributeTokenShares(l.tokenFrom, route)
        distributedTokens.add(l.tokenFrom.tokenId)
      }

      // 3. get pool's output address
      const outAddress = this.getPoolOutputAddress(l, route, toAddress)

      // 4. Make swap
      res += this.getCodeSwap(l, route, outAddress, exactAmount.get(l.poolAddress))
    })

    return res
  }

  public getCodeForsimpleWrap(route: SplitMultiRoute, toAddress: string): string {
    const hex = new HEXer()
      // wrapAndDistributeERC20Amounts
      .uint8(CommandCode.WRAP_AND_DISTRIBUTE_ERC20_AMOUNTS)
      .address(route.legs[0].poolAddress)
      .uint8(1)
      .address(toAddress)
      .uint(route.amountInBN)
    return hex.toString0x()
  }

  public setTokenOutputLegs(route: SplitMultiRoute): void {
    const tokenOutputLegs = new Map<string, RouteLeg[]>()

    route.legs.forEach((l) => {
      const tokenId = l.tokenFrom.tokenId?.toString()
      invariant(tokenId !== undefined, 'Unseted tokenId')

      const legsOutput = tokenOutputLegs.get(tokenId) || []
      legsOutput.push(l)
      tokenOutputLegs.set(tokenId, legsOutput)
    })

    this.tokenOutputLegs = tokenOutputLegs
  }

  public getPoolCode(l: RouteLeg): PoolCode {
    const pc = this.pools.get(l.poolAddress)
    if (!pc)
      throw new Error(`unknown pool: ${l.poolAddress}`)

    return pc
  }

  // Distributes tokens from msg.sender to pools
  public getCodeDistributeInitial(route: SplitMultiRoute): [string, Map<string, BigNumber>] {
    let fromToken = route.fromToken
    if (fromToken.address === '') {
      // Native
      fromToken = route.legs[0].tokenTo // Change to wrapped Native
    }

    const legs = this.tokenOutputLegs.get(fromToken.tokenId!)!
    const legsAddr: [RouteLeg, string][] = legs.map((l) => {
      const pc = this.getPoolCode(l)
      const startPoint = pc.getStartPoint(l, route)
      return [
        l,
        startPoint === PoolCode.RouteProcessorAddress
          ? this.routeProcessorAddress
          : startPoint,
      ]
    })

    const hex = new HEXer()
    if (route.fromToken.address === '') {
      // wrapAndDistributeERC20Amounts
      hex
        .uint8(CommandCode.WRAP_AND_DISTRIBUTE_ERC20_AMOUNTS)
        .address(route.legs[0].poolAddress)
    }
    else {
      // distributeERC20Amounts
      hex.uint8(CommandCode.DISTRIBUTE_ERC20_AMOUNTS)
    }

    hex.uint8(legsAddr.length)
    let inputAmountPrevious: BigNumber = BigNumber.from(0)
    const lastLeg = last(legsAddr)[0]
    const exactAmount = new Map<string, BigNumber>()
    legsAddr.forEach(([leg, poolAddress]) => {
      const amount: BigNumber = leg !== lastLeg
        ? getBigNumber(route.amountIn * leg.absolutePortion)
        : route.amountInBN.sub(inputAmountPrevious)
      hex.address(poolAddress).uint(amount)
      inputAmountPrevious = inputAmountPrevious.add(amount)
      exactAmount.set(leg.poolAddress, amount)
    })

    const code = hex.toString()
    return [code, exactAmount]
  }

  public getCodeDistributeTokenShares(token: BaseToken, route: SplitMultiRoute): string {
    const legs = this.tokenOutputLegs.get(token.tokenId!)!
    if (legs.length <= 1)
      return '' // No distribution is needed

    const startPointsNum = legs.filter((l) => {
      const pc = this.getPoolCode(l)
      const startPoint = pc.getStartPoint(l, route)
      return startPoint === PoolCode.RouteProcessorAddress
    }).length

    if (startPointsNum > 1)
      throw new Error('More than one input token is not supported by RouteProcessor')
    const hex = new HEXer()
      .uint8(CommandCode.DISTRIBUTE_ERC20_SHARES)
      .address(token.address)
      .uint8(legs.length - startPointsNum)

    let unmovedPart = 0
    let unmovedCounter = 0
    legs.forEach((l) => {
      const pc = this.getPoolCode(l)
      const startPoint = pc.getStartPoint(l, route)
      if (startPoint === PoolCode.RouteProcessorAddress) {
        unmovedPart += l.swapPortion
        ++unmovedCounter
      }
      else {
        const amount = l.swapPortion * (1 - unmovedPart)
        hex.address(startPoint).share16(amount)
      }
    })
    const code = hex.toString()
    invariant(
      code.length === (22 + (legs.length - unmovedCounter) * 22) * 2,
      'codeDistributeTokenShares unexpected code length',
    )
    return code
  }

  public getPoolOutputAddress(l: RouteLeg, route: SplitMultiRoute, toAddress: string): string {
    let outAddress: string
    const outputDistribution = this.tokenOutputLegs.get(l.tokenTo.tokenId!) || []
    if (!outputDistribution.length) {
      outAddress = toAddress
    }
    else if (outputDistribution.length === 1) {
      outAddress = this.getPoolCode(outputDistribution[0]).getStartPoint(l, route)
      if (outAddress === PoolCode.RouteProcessorAddress)
        outAddress = this.routeProcessorAddress
    }
    else {
      outAddress = this.routeProcessorAddress
    }
    return outAddress
  }

  public getCodeSwap(leg: RouteLeg, route: SplitMultiRoute, to: string, exactAmount?: BigNumber): string {
    const pc = this.getPoolCode(leg)
    return pc.getSwapCodeForRouteProcessor(leg, route, to, exactAmount)
  }
}

export function getRouteProcessorCode(
  route: SplitMultiRoute,
  routeProcessorAddress: string,
  toAddress: string,
  pools: Map<string, PoolCode>,
): string {
  const rp = new RouteProcessor(routeProcessorAddress, pools)
  return rp.getRouteCode(route, toAddress)
}
