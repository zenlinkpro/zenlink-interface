import type { RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import { ParachainId } from '@zenlink-interface/chain'
import invariant from 'tiny-invariant'
import type { Address } from 'viem'
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import { HEXer } from '../../HEXer'
import type { SyncPool } from '../pools'
import { PoolCode } from './PoolCode'

export class SyncPoolCode extends PoolCode {
  executor: { [chainId: number]: string } = {
    [ParachainId.SCROLL_ALPHA]: '0xe7c1acab844427b73DB06d965d71C14B37368108',
  } as const

  vault: { [chainId: number]: string } = {
    [ParachainId.SCROLL_ALPHA]: '0xBe87D2faF9863130D60fe0c454B5990863d45BBa',
  } as const

  public constructor(pool: SyncPool, providerName: string) {
    super(pool, providerName)
  }

  public override getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  public getProtocolExecutor(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'SyncPoolCode: Unseted chainId')
    return this.executor[Number(chainId)]
  }

  public override getProtocolExecutorStartPoint(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'SyncPoolCode: Unseted chainId')
    return this.vault[Number(chainId)]
  }

  public getSwapCodeForRouteProcessor(_leg: RouteLeg, _route: SplitMultiRoute, _to: string): string {
    return 'unsupported'
  }

  public override getSwapCodeForRouteProcessor2(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    return 'unsupported'
  }

  public override getSwapCodeForAggregationRouter(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const code = new HEXer()
      .address(this.getProtocolExecutor())
      .bytes(
        encodeAbiParameters(
          parseAbiParameters('address, address, address'),
          [
            this.pool.address as Address,
            this.getProtocolExecutorStartPoint() as Address,
            to as Address,
          ],
        ),
      )
      .toString()
    return code
  }
}
