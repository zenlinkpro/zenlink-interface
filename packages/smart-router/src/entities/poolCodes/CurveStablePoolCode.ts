import type { RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import { ParachainId } from '@zenlink-interface/chain'
import invariant from 'tiny-invariant'
import type { Address } from 'viem'
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import { HEXer } from '../../HEXer'
import type { StablePool } from '../pools/StablePool'
import { PoolCode } from './PoolCode'

const NATIVE_POOLS = [].map((p: string) => p.toLowerCase())

export class CurveStablePoolCode extends PoolCode {
  dispatcher: { [chainId: number]: string } = {
    [ParachainId.ARBITRUM_ONE]: '0x1B5a2f88420ff329406D108e641e52E46465F68e',
  } as const

  executor: { [chainId: number]: string } = {
    [ParachainId.MOONBEAM]: '0x79A22c8b3e3d29d466FF309692954e10652c2cAF',
    [ParachainId.BASE]: '0xf6EA707CBf38f2Acf3bf029429B55192c61c67ad',
  } as const

  public constructor(pool: StablePool, providerName: string) {
    super(pool, providerName)
  }

  public override getStartPoint(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'CurveStablePoolCode: Unseted chainId')
    return this.dispatcher[Number(chainId)]
  }

  public getProtocolExecutor(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'CurveStablePoolCode: Unseted chainId')
    return this.executor[Number(chainId)]
  }

  public override getProtocolExecutorStartPoint(): string {
    return this.getProtocolExecutor()
  }

  public getSwapCodeForRouteProcessor(_leg: RouteLeg, _route: SplitMultiRoute, _to: string): string {
    return 'unsupported'
  }

  public getSwapCodeForRouteProcessor2(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const tokenFromIndex
      = leg.tokenFrom.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
        ? (this.pool as StablePool).token0Index
        : (this.pool as StablePool).token1Index
    const tokenToIndex
      = leg.tokenTo.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
        ? (this.pool as StablePool).token0Index
        : (this.pool as StablePool).token1Index

    const poolData = encodeAbiParameters(
      parseAbiParameters('address, bool, int128, int128, address'),
      [
        leg.poolAddress as Address,
        NATIVE_POOLS.includes(leg.poolAddress.toLowerCase()),
        BigInt(tokenFromIndex),
        BigInt(tokenToIndex),
        leg.tokenTo.address as Address,
      ],
    )

    const code = new HEXer()
      .uint8(7) // curve stable pool
      .bool(false) // isMetaSwap
      .address(to)
      .bytes(poolData)
      .toString()

    return code
  }

  public override getSwapCodeForAggregationRouter(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const tokenFromIndex
      = leg.tokenFrom.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
        ? (this.pool as StablePool).token0Index
        : (this.pool as StablePool).token1Index
    const tokenToIndex
      = leg.tokenTo.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
        ? (this.pool as StablePool).token0Index
        : (this.pool as StablePool).token1Index

    const poolData = encodeAbiParameters(
      parseAbiParameters('address, bool, int128, int128, address'),
      [
        leg.poolAddress as Address,
        NATIVE_POOLS.includes(leg.poolAddress.toLowerCase()),
        BigInt(tokenFromIndex),
        BigInt(tokenToIndex),
        leg.tokenTo.address as Address,
      ],
    )

    const code = new HEXer()
      .address(this.getProtocolExecutor())
      .bytes(
        encodeAbiParameters(
          parseAbiParameters('uint8, address, bytes'),
          [
            0, // isMetaSwap
            to as Address,
            poolData,
          ],
        ),
      )
      .toString()
    return code
  }
}
