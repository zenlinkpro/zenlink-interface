import type { RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import { ParachainId } from '@zenlink-interface/chain'
import invariant from 'tiny-invariant'
import type { Address } from 'viem'
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import { CommandCode } from '../../CommandCode'
import { HEXer } from '../../HEXer'
import type { MetaPool } from '../pools/MetaPool'
import { PoolCode } from './PoolCode'

export class MetaPoolCode extends PoolCode {
  dispatcher: { [chainId: number]: string } = {
    [ParachainId.ASTAR]: '0xf3780EBbF5C0055c0951EC1c2Abc1b3D77713459',
  } as const

  executor: { [chainId: number]: string } = {
    [ParachainId.MOONBEAM]: '0xf6626F6a906DCA97C816c06DD32FFEC40761de34',
  } as const

  public constructor(pool: MetaPool, providerName: string) {
    super(pool, providerName)
  }

  public override getStartPoint(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'MetaPoolCode: Unseted chainId')
    return this.dispatcher[Number(chainId)]
  }

  public getProtocolExecutor(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'AlgebraPoolCode: Unseted chainId')
    return this.executor[Number(chainId)]
  }

  public override getProtocolExecutorStartPoint(): string {
    return this.getProtocolExecutor()
  }

  public getSwapCodeForRouteProcessor(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const tokenFromIndex
      = leg.tokenFrom.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
        ? (this.pool as MetaPool).token0Index
        : (this.pool as MetaPool).token1Index
    const tokenToIndex
      = leg.tokenTo.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
        ? (this.pool as MetaPool).token0Index
        : (this.pool as MetaPool).token1Index

    const poolData = encodeAbiParameters(
      parseAbiParameters('address, uint8, uint8, address, address'),
      [
        leg.poolAddress as Address,
        tokenFromIndex,
        tokenToIndex,
        leg.tokenFrom.address as Address,
        leg.tokenTo.address as Address,
      ],
    )

    const code = new HEXer()
      .uint8(CommandCode.SWAP_ZENLINK_STABLE_POOL)
      .bool(true) // isMetaSwap
      .address(to)
      .bytes(poolData)
      .toString()

    return code
  }

  public getSwapCodeForRouteProcessor2(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const tokenFromIndex
    = leg.tokenFrom.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
      ? (this.pool as MetaPool).token0Index
      : (this.pool as MetaPool).token1Index
    const tokenToIndex
    = leg.tokenTo.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
      ? (this.pool as MetaPool).token0Index
      : (this.pool as MetaPool).token1Index

    const poolData = encodeAbiParameters(
      parseAbiParameters('address, uint8, uint8, address'),
      [
        leg.poolAddress as Address,
        tokenFromIndex,
        tokenToIndex,
        leg.tokenTo.address as Address,
      ],
    )

    const code = new HEXer()
      .uint8(3) // stableswap pool
      .bool(true) // isMetaSwap
      .address(to)
      .bytes(poolData)
      .toString()

    return code
  }

  public override getSwapCodeForAggregationRouter(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const tokenFromIndex
    = leg.tokenFrom.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
      ? (this.pool as MetaPool).token0Index
      : (this.pool as MetaPool).token1Index
    const tokenToIndex
    = leg.tokenTo.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
      ? (this.pool as MetaPool).token0Index
      : (this.pool as MetaPool).token1Index

    const poolData = encodeAbiParameters(
      parseAbiParameters('address, uint8, uint8, address'),
      [
        leg.poolAddress as Address,
        tokenFromIndex,
        tokenToIndex,
        leg.tokenTo.address as Address,
      ],
    )

    const code = new HEXer()
      .address(this.getProtocolExecutor())
      .bytes(
        encodeAbiParameters(
          parseAbiParameters('uint8, address, bytes'),
          [
            1, // isMetaSwap
            to as Address,
            poolData,
          ],
        ),
      )
      .toString()

    return code
  }
}
