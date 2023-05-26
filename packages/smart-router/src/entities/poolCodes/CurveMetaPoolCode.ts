import type { RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import { ParachainId } from '@zenlink-interface/chain'
import type { Address } from 'viem'
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import invariant from 'tiny-invariant'
import { HEXer } from '../../HEXer'
import type { MetaPool } from '../pools/MetaPool'
import { PoolCode } from './PoolCode'

export class CurveMetaPoolCode extends PoolCode {
  dispatcher: { [chainId: number]: string } = {
    [ParachainId.ARBITRUM_ONE]: '0x1B5a2f88420ff329406D108e641e52E46465F68e',
  } as const

  public constructor(pool: MetaPool, providerName: string) {
    super(pool, providerName)
  }

  public override getStartPoint(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'MetaPoolCode: Unseted chainId')
    return this.dispatcher[Number(chainId)]
  }

  public getSwapCodeForRouteProcessor(_leg: RouteLeg, _route: SplitMultiRoute, _to: string): string {
    return 'unsupported'
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
      parseAbiParameters('address, int128, int128, address'),
      [
        leg.poolAddress as Address,
        BigInt(tokenFromIndex),
        BigInt(tokenToIndex),
        leg.tokenTo.address as Address,
      ],
    )

    const code = new HEXer()
      .uint8(7) // curve stable pool
      .bool(true) // isMetaSwap
      .address(to)
      .bytes(poolData)
      .toString()

    return code
  }
}
