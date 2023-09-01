import type { RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import invariant from 'tiny-invariant'
import { ParachainId } from '@zenlink-interface/chain'
import type { Address } from 'viem'
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import { CommandCode } from '../../CommandCode'
import { HEXer } from '../../HEXer'
import type { StandardPool } from '../pools/StandardPool'
import { PoolCode } from './PoolCode'

export class StandardPoolCode extends PoolCode {
  executor: { [chainId: number]: string } = {
    [ParachainId.MOONBEAM]: '0xf6E1F3e311fF6783E44fA37aacD732270CEc8544',
    [ParachainId.BASE]: '0x7b3f25a62F3557661812Ee91d9552d6fb6a57EDd',
    [ParachainId.ASTAR]: '0x8291d744D5Fe8F9d5843CaBE6d6a82EB12b1E0B8',
  } as const

  public constructor(pool: StandardPool, providerName: string) {
    super(pool, providerName)
  }

  public getProtocolExecutor(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'StandardPoolCode: Unseted chainId')
    return this.executor[Number(chainId)]
  }

  public override getProtocolExecutorStartPoint(): string {
    return this.pool.address
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
