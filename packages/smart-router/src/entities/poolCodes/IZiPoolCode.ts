import type { RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import { ParachainId } from '@zenlink-interface/chain'
import invariant from 'tiny-invariant'
import type { Address } from 'viem'
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import { HEXer } from '../../HEXer'
import type { IZiPool } from '../pools'
import { PoolCode } from './PoolCode'

export class IZiPoolCode extends PoolCode {
  executor: { [chainId: number]: string } = {
    [ParachainId.SCROLL_TESTNET]: '0xbA2aF4Bdeeedb43948bcAbDbD68Eb7904ACc4316',
  } as const

  public constructor(pool: IZiPool, providerName: string) {
    super(pool, providerName)
  }

  public getProtocolExecutor(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'IZiPoolCode: Unseted chainId')
    return this.executor[Number(chainId)]
  }

  public override getProtocolExecutorStartPoint(): string {
    return this.getProtocolExecutor()
  }

  public getSwapCodeForRouteProcessor(_leg: RouteLeg, _route: SplitMultiRoute, _to: string): string {
    return 'unsupported'
  }

  public override getSwapCodeForRouteProcessor2(_leg: RouteLeg, _route: SplitMultiRoute, _to: string): string {
    return 'unsupported'
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
