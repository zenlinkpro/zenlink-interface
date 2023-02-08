import { CommandCode } from '../../CommandCode'
import { HEXer } from '../../HEXer'
import type { RouteLeg } from '../Graph'
import type { NatvieWrapPool } from './NativeWrapPool'
import { PoolCode } from './PoolCode'

export class NativeWrapPoolCode extends PoolCode {
  public constructor(pool: NatvieWrapPool) {
    super(pool, 'Wrap Native')
  }

  public override getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  public getSwapCodeForRouteProcessor(leg: RouteLeg): string {
    if (leg.tokenFrom.tokenId === this.pool.token0.tokenId) {
      // wrap - deposit. not used normally
      // wrapAndDistributeERC20Amounts
      const code = new HEXer()
        .uint8(CommandCode.WRAP_AND_DISTRIBUTE_ERC20_AMOUNTS)
        .address(this.pool.address)
        .uint8(0)
        .toString()
      return code
    }
    else {
      // unwrap - withdraw
      // unwrapNative(address receiver, unwrap token)
      const code = new HEXer()
        .uint8(CommandCode.UNWRAP_NATIVE)
        .address(this.pool.address)
        .toString()
      return code
    }
  }
}
