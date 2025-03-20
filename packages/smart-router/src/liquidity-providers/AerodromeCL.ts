import type { BaseToken } from '@zenlink-interface/amm'
import type { Token } from '@zenlink-interface/currency'
import type { Address, PublicClient } from 'viem'
import type { PoolCode, UniV3Tick } from '../entities'
import { BigNumber } from '@ethersproject/bignumber'
import { chainsParachainIdToChainId, ParachainId } from '@zenlink-interface/chain'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@zenlink-interface/router-config'
import { velodromeCLStateMulticall } from '../abis/velodromeCLStateMulticall'
import { UniV3Pool, UniV3PoolCode } from '../entities'
import { formatAddress } from '../util'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

interface PoolInfo {
  token0: Token
  token1: Token
  tickSpacing: number
}

export class AerodromeCLProvider extends LiquidityProvider {
  public readonly TICK_SPACINGS = [1, 50, 100, 200, 2_000]
  public readonly BIT_AMOUNT = 0
  public poolCodes: PoolCode[] = []

  public readonly initialPools: Map<string, PoolInfo> = new Map()

  private unwatchBlockNumber?: () => void

  public readonly factory: { [chainId: number]: Address } = {
    [ParachainId.BASE]: '0x5e7BB104d84c7CB9B682AaC2F3d509f5F406809A',
  }

  public readonly stateMultiCall: { [chainId: number]: Address } = {
    [ParachainId.BASE]: '0xdB0173371d00344e576A060E3e0A5f9fe2FA988B',
  }

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public async getPools(tokens: Token[]) {
    if (!(this.chainId in this.factory) || !(this.chainId in this.stateMultiCall)) {
      this.lastUpdateBlock = -1
      return
    }

    // tokens deduplication
    const tokenMap = new Map<string, Token>()
    tokens.forEach(t => tokenMap.set(formatAddress(t.address), t))
    const tokensDedup = Array.from(tokenMap.values())
    // tokens sorting
    const tok0: [string, Token][] = tokensDedup.map(t => [formatAddress(t.address), t])
    tokens = tok0.sort((a, b) => (b[0] > a[0] ? -1 : 1)).map(([_, t]) => t)

    const pools: PoolInfo[] = []
    for (let i = 0; i < tokens.length; ++i) {
      const t0 = tokens[i]
      for (let j = i + 1; j < tokens.length; ++j) {
        const t1 = tokens[j]
        this.TICK_SPACINGS.forEach((tickSpacing) => {
          pools.push({ token0: t0, token1: t1, tickSpacing })
        })
      }
    }

    const poolState = await this.client.multicall({
      allowFailure: true,
      contracts: pools.map(
        pool =>
          ({
            args: [
              this.factory[this.chainId] as Address,
              pool.token0.address as Address,
              pool.token1.address as Address,
              pool.tickSpacing,
              this.BIT_AMOUNT,
              this.BIT_AMOUNT,
            ],
            address: this.stateMultiCall[this.chainId] as Address,
            chainId: chainsParachainIdToChainId[this.chainId],
            abi: velodromeCLStateMulticall,
            functionName: 'getFullStateWithRelativeBitmaps',
          } as const),
      ),
    })

    const ticksMap = new Map<string, { index: number, value: bigint }[]>()
    poolState.forEach((state) => {
      if (state.status !== 'success' || !state.result)
        return
      const address = state.result?.pool
      const tickBitmap = state.result?.tickBitmap
      if (!address || !tickBitmap)
        return
      const tickMap = ticksMap.get(address) || []
      tickMap.concat(tickBitmap)
      ticksMap.set(address, tickMap)
    })

    pools.forEach((pool, i) => {
      if (poolState?.[i].status !== 'success' || !poolState?.[i].result)
        return

      const address = poolState[i].result.pool
      const balance0 = poolState[i].result.balance0
      const balance1 = poolState[i].result.balance1
      const tick = poolState[i].result.slot0.tick
      const fee = poolState[i].result.fee
      const liquidity = poolState[i].result.liquidity
      const sqrtPriceX96 = poolState[i].result.slot0.sqrtPriceX96
      const tickBitmap = ticksMap.get(address)

      if (
        !address
        || !tick
        || !fee
        || !liquidity
        || !sqrtPriceX96
        || (!balance0 || BigNumber.from(balance0).lt(BigInt(10 ** pool.token0.decimals)))
        || (!balance1 || BigNumber.from(balance1).lt(BigInt(10 ** pool.token1.decimals)))
        || !tickBitmap
      ) {
        return
      }

      const ticks: UniV3Tick[] = Array.from(tickBitmap).sort((a, b) => a.index - b.index).map(tick => ({ index: tick.index, DLiquidity: BigNumber.from(tick.value) }))

      const v3pool = new UniV3Pool(
        address,
        pool.token0 as BaseToken,
        pool.token1 as BaseToken,
        fee / 1000000,
        BigNumber.from(balance0),
        BigNumber.from(balance1),
        tick,
        BigNumber.from(liquidity),
        BigNumber.from(sqrtPriceX96),
        ticks,
      )
      const pc = new UniV3PoolCode(v3pool, this.getPoolProviderName())
      this.initialPools.set(address, pool)
      this.poolCodes.push(pc)
      ++this.stateId
    })
  }

  private _getProspectiveTokens(t0: Token, t1: Token): Token[] {
    const set = new Set<Token>([
      t0,
      t1,
      ...BASES_TO_CHECK_TRADES_AGAINST[this.chainId],
      ...(ADDITIONAL_BASES[this.chainId]?.[t0.address] || []),
      ...(ADDITIONAL_BASES[this.chainId]?.[t1.address] || []),
    ])
    return Array.from(set)
  }

  public startFetchPoolsData() {
    this.stopFetchPoolsData()
    this.poolCodes = []
    this.getPools(BASES_TO_CHECK_TRADES_AGAINST[this.chainId]) // starting the process
    this.unwatchBlockNumber = this.client.watchBlockNumber({
      onBlockNumber: (blockNumber) => {
        this.lastUpdateBlock = Number(blockNumber)
      },
      onError: (error) => {
        console.error(error.message)
      },
    })
  }

  public async fetchPoolsForToken(t0: Token, t1: Token): Promise<void> {
    await this.getPools(this._getProspectiveTokens(t0, t1))
  }

  public getCurrentPoolList(): PoolCode[] {
    return this.poolCodes
  }

  public stopFetchPoolsData() {
    if (this.unwatchBlockNumber)
      this.unwatchBlockNumber()
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.AerodromeCL
  }

  public getPoolProviderName(): string {
    return 'AerodromeCL'
  }
}
