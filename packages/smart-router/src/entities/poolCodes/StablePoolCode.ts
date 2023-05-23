import type { RouteLeg, SplitMultiRoute } from '@zenlink-interface/amm'
import { ParachainId } from '@zenlink-interface/chain'
import { ethers } from 'ethers'
import invariant from 'tiny-invariant'
import { CommandCode } from '../../CommandCode'
import { HEXer } from '../../HEXer'
import type { StablePool } from '../pools/StablePool'
import { PoolCode } from './PoolCode'

export const NATIVE_POOLS = [
  '0xEEa640c27620D7C448AD655B6e3FB94853AC01e3', // Sirius-ASTR/nASTR
].map(p => p.toLowerCase())

export class StablePoolCode extends PoolCode {
  dispatcher: { [chainId: number]: string } = {
    [ParachainId.ASTAR]: '0xf3780EBbF5C0055c0951EC1c2Abc1b3D77713459',
    // TODO: remove after add curve swap in universal-router
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

  public getSwapCodeForRouteProcessor(leg: RouteLeg, _route: SplitMultiRoute, to: string): string {
    const tokenFromIndex
      = leg.tokenFrom.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
        ? (this.pool as StablePool).token0Index
        : (this.pool as StablePool).token1Index
    const tokenToIndex
      = leg.tokenTo.address?.toLowerCase() === this.pool.token0.address?.toLowerCase()
        ? (this.pool as StablePool).token0Index
        : (this.pool as StablePool).token1Index

    const coder = new ethers.utils.AbiCoder()
    const poolData = coder.encode(
      ['address', 'bool', 'uint8', 'uint8', 'address', 'address'],
      [
        leg.poolAddress,
        NATIVE_POOLS.includes(leg.poolAddress.toLowerCase()),
        tokenFromIndex,
        tokenToIndex,
        leg.tokenFrom.address,
        leg.tokenTo.address,
      ],
    )
    const code = new HEXer()
      .uint8(CommandCode.SWAP_ZENLINK_STABLE_POOL)
      .bool(false) // isMetaSwap
      .address(to)
      .bytes(poolData)
      .toString()

    return code
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

    const coder = new ethers.utils.AbiCoder()
    const poolData = coder.encode(
      ['address', 'bool', 'uint8', 'uint8', 'address'],
      [
        leg.poolAddress,
        NATIVE_POOLS.includes(leg.poolAddress.toLowerCase()),
        tokenFromIndex,
        tokenToIndex,
        leg.tokenTo.address,
      ],
    )
    const code = new HEXer()
      .uint8(3) // stableswap pool
      .bool(false) // isMetaSwap
      .address(to)
      .bytes(poolData)
      .toString()

    return code
  }
}
