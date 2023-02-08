import { ParachainId } from '@zenlink-interface/chain'
import { ethers } from 'ethers'
import invariant from 'tiny-invariant'
import { CommandCode } from '../../CommandCode'
import { HEXer } from '../../HEXer'
import type { MultiRoute, RouteLeg } from '../Graph'
import { PoolCode } from './PoolCode'
import type { StablePool } from './StablePool'

export class StablePoolCode extends PoolCode {
  dispatcher: { [chainId: number]: string } = {
    [ParachainId.ASTAR]: '0xf267704dD1393c26B39A6D41F49Bea233B34F721',
  } as const

  public constructor(pool: StablePool, providerName: string) {
    super(pool, `${providerName} ${pool.fee * 100}%`)
  }

  public override getStartPoint(): string {
    const chainId = this.pool.token0.chainId
    invariant(chainId !== undefined, 'StablePoolCode: Unseted chainId')
    return this.dispatcher[Number(chainId)]
  }

  public getSwapCodeForRouteProcessor(leg: RouteLeg, _route: MultiRoute, to: string): string {
    const coder = new ethers.utils.AbiCoder()
    const poolData = coder.encode(
      ['address', 'address'],
      [leg.tokenFrom.address, leg.tokenTo.address],
    )
    const code = new HEXer()
      .uint8(CommandCode.SWAP_ZENLINK_STABLE_POOL)
      .address(leg.poolAddress)
      .address(to)
      .bytes(poolData)
      .toString()

    return code
  }
}
