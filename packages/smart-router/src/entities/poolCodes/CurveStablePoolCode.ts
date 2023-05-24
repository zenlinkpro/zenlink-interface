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
    // TODO: replace after deployed
    [ParachainId.ARBITRUM_ONE]: '0xf3780EBbF5C0055c0951EC1c2Abc1b3D77713459',
  } as const

  public constructor(pool: StablePool, providerName: string) {
    super(pool, providerName)
  }

  public override getStartPoint(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'StablePoolCode: Unseted chainId')
    return this.dispatcher[Number(chainId)]
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
      parseAbiParameters('address pool, bool isNative, int128 tokenFromIndex, int128 tokenToIndex, address tokenTo'),
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
}
