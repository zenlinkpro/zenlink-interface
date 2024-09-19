import type { RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import type { NatvieWrapPool } from '../pools/NativeWrapPool'
import { CommandCode } from '../../CommandCode'
import { HEXer } from '../../HEXer'
import { PoolCode } from './PoolCode'

export class NativeWrapPoolCode extends PoolCode {
  public constructor(pool: NatvieWrapPool) {
    super(pool, 'Wrap')
  }

  public override getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  public override getProtocolExecutorStartPoint(): string {
    return PoolCode.ProtocolExecutorAddress
  }

  public getSwapCodeForRouteProcessor(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
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
        .address(to)
        .toString()
      return code
    }
  }

  public getSwapCodeForRouteProcessor2(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    if (leg.tokenFrom.tokenId === this.pool.token0.tokenId) {
      // wrap - deposit
      const code = new HEXer()
        .uint8(2) // wrapNative pool type
        .uint8(1) // wrap action
        .address(to) // where to transfer native coin after unwrapping
        .address(this.pool.address) // wrap token
        .toString()
      return code
    }
    else {
      // unwrap - withdraw
      const code = new HEXer()
        .uint8(2) // wrapNative pool type
        .uint8(0) // unwrap action
        .address(to) // where to transfer native coin after unwrapping
        .toString()
      return code
    }
  }

  public override getSwapCodeForAggregationRouter(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    if (leg.tokenFrom.tokenId === this.pool.token0.tokenId) {
      // wrap - deposit
      const code = new HEXer()
        .uint8(1) // wrap action
        .address(to) // where to transfer native coin after unwrapping
        .address(this.pool.address) // wrap token
        .toString()
      return code
    }
    else {
      // unwrap - withdraw
      const code = new HEXer()
        .uint8(0) // unwrap action
        .address(to) // where to transfer native coin after unwrapping
        .toString()
      return code
    }
  }
}
