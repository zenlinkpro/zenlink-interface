import type { RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import { HEXer } from '../../HEXer'
import type { GmxPool } from '../pools/GmxPool'
import { PoolCode } from './PoolCode'

export class GmxPoolCode extends PoolCode {
  public constructor(pool: GmxPool, providerName: string) {
    super(pool, providerName)
  }

  public getSwapCodeForRouteProcessor(_leg: RouteLeg, _route: SplitMultiRoute, _to: string): string {
    return 'unsupported'
  }

  public override getSwapCodeForRouteProcessor2(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const code = new HEXer()
      .uint8(4) // gmx pool
      .address(this.pool.address)
      .address(leg.tokenTo.address!)
      .address(to)
      .toString()
    return code
  }
}
