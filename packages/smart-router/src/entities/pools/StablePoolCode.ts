import invariant from 'tiny-invariant'
import { HEXer } from '../../HEXer'
import type { MultiRoute, RouteLeg } from '../Graph'
import { PoolCode } from './PoolCode'
import type { StablePool } from './StablePool'

export class StablePoolCode extends PoolCode {
  public constructor(pool: StablePool, providerName: string) {
    super(pool, `${providerName} ${pool.fee * 100}%`)
  }

  public getSwapCodeForRouteProcessor(leg: RouteLeg, _route: MultiRoute, to: string): string {
    // TODO
    const code = new HEXer()
      .uint8(10) // swapUniswapPool
      .address(this.pool.address)
      .address(leg.tokenFrom.address)
      .bool(leg.tokenFrom.address === this.pool.token0.address)
      .address(to)
      .toString()
    invariant(code.length === 62 * 2, 'getSwapCodeForRouteProcessor unexpected code length')
    return code
  }
}
