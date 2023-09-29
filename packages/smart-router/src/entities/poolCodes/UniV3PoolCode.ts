import type { RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import { ParachainId } from '@zenlink-interface/chain'
import invariant from 'tiny-invariant'
import type { Address } from 'viem'
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import { HEXer } from '../../HEXer'
import type { UniV3Pool } from '../pools/UniV3Pool'
import { PoolCode } from './PoolCode'

export class UniV3PoolCode extends PoolCode {
  executor: { [chainId: number]: string } = {
    [ParachainId.SCROLL_ALPHA]: '0xB2c26294c3Fd8B73E887Bf9002fA70DbC6759841',
    [ParachainId.BASE]: '0x7B1128E610ae1d461B7B8227f9FBBB39e336c515',
    [ParachainId.MOONBEAM]: '0x9587426f304eD59d15a8834bf0bA91B1872F3c24'
  } as const

  public constructor(pool: UniV3Pool, providerName: string) {
    super(pool, providerName)
  }

  public override getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  public getProtocolExecutor(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'UniV3PoolCode: Unseted chainId')
    return this.executor[Number(chainId)]
  }

  public override getProtocolExecutorStartPoint(): string {
    return this.getProtocolExecutor()
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

  public override getSwapCodeForAggregationRouter(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const code = new HEXer()
      .address(this.getProtocolExecutor())
      .bytes(
        encodeAbiParameters(
          parseAbiParameters('address, bool, address'),
          [
            this.pool.address as Address,
            leg.tokenFrom.address === this.pool.token0.address,
            to as Address,
          ],
        ),
      )
      .toString()
    return code
  }
}
