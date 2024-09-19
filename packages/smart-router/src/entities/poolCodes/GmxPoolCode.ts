import type { RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import type { Address } from 'viem'
import type { GmxPool } from '../pools/GmxPool'
import { ParachainId } from '@zenlink-interface/chain'
import invariant from 'tiny-invariant'
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import { HEXer } from '../../HEXer'
import { PoolCode } from './PoolCode'

export class GmxPoolCode extends PoolCode {
  executor: { [chainId: number]: string } = {
    [ParachainId.MOONBEAM]: '0x7Ad8989699D44d1b9DA30cfFe82904c108e20Db0',
  } as const

  vault: { [chainId: number]: string } = {
    [ParachainId.MOONBEAM]: '0x73197B461eA369b36d5ee96A1C9f090Ef512be21',
  } as const

  public constructor(pool: GmxPool, providerName: string) {
    super(pool, providerName)
  }

  public getProtocolExecutor(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'GmxPoolCode: Unseted chainId')
    return this.executor[Number(chainId)]
  }

  public override getProtocolExecutorStartPoint(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'GmxPoolCode: Unseted chainId')
    return this.vault[Number(chainId)]
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

  public override getSwapCodeForAggregationRouter(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const code = new HEXer()
      .address(this.getProtocolExecutor())
      .bytes(
        encodeAbiParameters(
          parseAbiParameters('address, address, address'),
          [
            this.getProtocolExecutorStartPoint() as Address,
            leg.tokenTo.address as Address,
            to as Address,
          ],
        ),
      )
      .toString()
    return code
  }
}
