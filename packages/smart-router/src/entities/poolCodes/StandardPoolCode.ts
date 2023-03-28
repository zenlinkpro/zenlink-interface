import type { RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import invariant from 'tiny-invariant'
import { CommandCode } from '../../CommandCode'
import { HEXer } from '../../HEXer'
import type { StandardPool } from '../pools/StandardPool'
import { PoolCode } from './PoolCode'

export class StandardPoolCode extends PoolCode {
  public constructor(pool: StandardPool, providerName: string) {
    super(pool, providerName)
  }

  public getSwapCodeForRouteProcessor(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    // swapUniswapPool = 0x20(address pool, address tokenIn, bool direction, address to)
    const code = new HEXer()
      // swapUniswapPool
      .uint8(CommandCode.SWAP_UNISWAP_V2)
      .address(this.pool.address)
      .address(leg.tokenFrom.address!)
      .bool(leg.tokenFrom.address === this.pool.token0.address)
      .address(to)
      .toString()
    invariant(code.length === 62 * 2, 'getSwapCodeForRouteProcessor unexpected code length')
    return code
  }

  public getSwapCodeForRouteProcessor2(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const code = new HEXer()
      .uint8(0) // uniV2 pool
      .address(this.pool.address)
      .bool(leg.tokenFrom.address === this.pool.token0.address)
      .address(to)
      .toString()
    return code
  }
}
