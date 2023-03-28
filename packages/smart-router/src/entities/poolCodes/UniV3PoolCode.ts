import type { RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import { HEXer } from '../../HEXer'
import type { UniV3Pool } from '../pools/UniV3Pool'
import { PoolCode } from './PoolCode'

export class UniV3PoolCode extends PoolCode {
  public constructor(pool: UniV3Pool, providerName: string) {
    super(pool, providerName)
  }

  public override getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  public getSwapCodeForRouteProcessor(_leg: RouteLeg, _route: SplitMultiRoute, _to: string): string {
    return 'unsupported'
  }

  public override getSwapCodeForRouteProcessor2(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const code = new HEXer()
      .uint8(1) // uniV3 pool
      .address(this.pool.address)
      .bool(leg.tokenFrom.address === this.pool.token0.address)
      .address(to)
      .toString()
    return code
  }
}
