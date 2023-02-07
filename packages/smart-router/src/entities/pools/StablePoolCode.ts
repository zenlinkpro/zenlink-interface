import { ethers } from 'ethers'
import { CommandCode } from '../../CommandCode'
import { HEXer } from '../../HEXer'
import type { MultiRoute, RouteLeg } from '../Graph'
import { PoolCode } from './PoolCode'
import type { StablePool } from './StablePool'

export class StablePoolCode extends PoolCode {
  public constructor(pool: StablePool, providerName: string) {
    super(pool, `${providerName} ${pool.fee * 100}%`)
  }

  public getSwapCodeForRouteProcessor(leg: RouteLeg, _route: MultiRoute, _to: string): string {
    const coder = new ethers.utils.AbiCoder()
    const poolData = coder.encode(
      ['address', 'address'],
      [leg.tokenFrom.address, leg.tokenTo.address],
    )
    const code = new HEXer()
      .uint8(CommandCode.SWAP_ZENLINK_STABLE_POOL)
      .address(leg.poolAddress)
      .bytes(poolData)
      .toString()

    return code
  }
}
