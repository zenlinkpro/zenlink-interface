import type { RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import invariant from 'tiny-invariant'
import { ParachainId } from '@zenlink-interface/chain'
import type { Address } from 'viem'
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import { HEXer } from '../../HEXer'
import type { SolidlyPool } from '../pools'
import { PoolCode } from './PoolCode'

export class VelodromeV2PoolCode extends PoolCode {
  executor: { [chainId: number]: string } = {
    [ParachainId.BASE]: '0x1B5a2f88420ff329406D108e641e52E46465F68e',
    [ParachainId.SCROLL]: '0x7b3f25a62F3557661812Ee91d9552d6fb6a57EDd',
  } as const

  public constructor(pool: SolidlyPool, providerName: string) {
    super(pool, providerName)
  }

  public getProtocolExecutor(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'VelodromeV2PoolCode: Unseted chainId')
    return this.executor[Number(chainId)]
  }

  public override getProtocolExecutorStartPoint(): string {
    return this.pool.address
  }

  public getSwapCodeForRouteProcessor(_leg: RouteLeg, _route: SplitMultiRoute, _to: string): string {
    return 'unsupported'
  }

  public getSwapCodeForRouteProcessor2(_leg: RouteLeg, _route: SplitMultiRoute, _to: string): string {
    return 'unsupported'
  }

  public override getSwapCodeForAggregationRouter(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const code = new HEXer()
      .address(this.getProtocolExecutor())
      .bytes(
        encodeAbiParameters(
          parseAbiParameters('address, uint8, address'),
          [
            this.pool.address as Address,
            leg.tokenFrom.address === this.pool.token0.address ? 1 : 0,
            to as Address,
          ],
        ),
      )
      .toString()
    return code
  }
}
