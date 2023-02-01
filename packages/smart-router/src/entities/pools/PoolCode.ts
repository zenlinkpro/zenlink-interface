import type { BigNumber } from 'ethers'
import type { MultiRoute, RouteLeg } from '../Graph'
import type { BasePool } from './BasePool'

export abstract class PoolCode {
  public readonly pool: BasePool
  public readonly poolName: string

  public constructor(pool: BasePool, poolName: string) {
    this.pool = pool
    this.poolName = poolName
  }

  public static RouteProcessorAddress = 'RouteProcessor'

  // the address where should be swap amount of liquidity before the swap
  // returns RouteProcessorAddress if it is a RouteProcessor
  public getStartPoint(_leg: RouteLeg, _route: MultiRoute): string {
    return this.pool.address
  }

  public abstract getSwapCodeForRouteProcessor(
    leg: RouteLeg,
    route: MultiRoute,
    to: string,
    exactAmount?: BigNumber
  ): string
}
