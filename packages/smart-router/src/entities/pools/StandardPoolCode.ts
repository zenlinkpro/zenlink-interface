import invariant from 'tiny-invariant'
import { CommandCode } from '../../CommandCode'
import { HEXer } from '../../HEXer'
import type { MultiRoute, RouteLeg } from '../Graph'
import { PoolCode } from './PoolCode'
import type { StandardPool } from './StandardPool'

export class StandardPoolCode extends PoolCode {
  public constructor(pool: StandardPool, providerName: string) {
    super(pool, `${providerName} ${pool.fee * 100}%`)
  }

  public getSwapCodeForRouteProcessor(leg: RouteLeg, _route: MultiRoute, to: string): string {
    // swapUniswapPool = 0x20(address pool, address tokenIn, bool direction, address to)
    const code = new HEXer()
      // swapUniswapPool
      .uint8(CommandCode.SWAP_UNISWAP_V2)
      .address(this.pool.address)
      .address(leg.tokenFrom.address)
      .bool(leg.tokenFrom.address === this.pool.token0.address)
      .address(to)
      .toString()
    invariant(code.length === 62 * 2, 'getSwapCodeForRouteProcessor unexpected code length')
    return code
  }
}
