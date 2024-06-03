import type { RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import type { BigNumber } from '@ethersproject/bignumber'
import type { BasePool } from '../pools/BasePool'

export abstract class PoolCode {
  public readonly pool: BasePool
  public readonly poolName: string

  public constructor(pool: BasePool, poolName: string) {
    this.pool = pool
    this.poolName = poolName
  }

  public static RouteProcessorAddress = 'RouteProcessor'
  public static ProtocolExecutorAddress = 'ProtocolExecutor'

  // the address where should be swap amount of liquidity before the swap
  // returns RouteProcessorAddress if it is a RouteProcessor
  public getStartPoint(_leg: RouteLeg, _route: SplitMultiRoute): string {
    return this.pool.address
  }

  // the address where should be swap amount of liquidity before the swap
  // returns ProtocolExecutorAddress if it is a ProtocolExecutor
  public getProtocolExecutorStartPoint(_leg: RouteLeg, _route: SplitMultiRoute): string {
    return PoolCode.ProtocolExecutorAddress
  }

  public abstract getSwapCodeForRouteProcessor(
    leg: RouteLeg,
    route: SplitMultiRoute,
    to: string,
    exactAmount?: BigNumber
  ): string

  public getSwapCodeForRouteProcessor2(_leg: RouteLeg, _route: SplitMultiRoute, _to: string): string {
    return 'unimplemented'
  }

  public getSwapCodeForAggregationRouter(_leg: RouteLeg, _route: SplitMultiRoute, _to: string): string {
    return 'unimplemented'
  }
}
