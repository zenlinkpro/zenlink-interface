import { ParachainId, chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Address, PublicClient } from 'viem'
import type { Token } from '@zenlink-interface/currency'
import { BigNumber } from '@ethersproject/bignumber'
import type { BaseToken } from '@zenlink-interface/amm'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@zenlink-interface/router-config'
import type { PoolCode, UniV3Tick } from '../entities'
import { BeamV3PoolCode, UniV3Pool } from '../entities'
import { uniswapV3StateMulticall } from '../abis/uniswapV3StateMulticall'
import { formatAddress } from '../util'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

interface PoolInfo {
  token0: Token
  token1: Token
  swapFee: number
}

export class BeamSwapV3Provider extends LiquidityProvider {
  public readonly SWAP_FEES = [0.0001, 0.0005, 0.003, 0.01]
  public readonly BIT_AMOUNT = 0
  public poolCodes: PoolCode[] = []

  public readonly initialPools: Map<string, PoolInfo> = new Map()

  private unwatchBlockNumber?: () => void

  public readonly factory: { [chainId: number]: Address } = {
    [ParachainId.MOONBEAM]: '0xD118fa707147c54387B738F54838Ea5dD4196E71',
  }

  public readonly stateMultiCall: { [chainId: number]: Address } = {
    [ParachainId.MOONBEAM]: '0x135853E7921ec8D9CAFAaDd4B9B6C04AF7684Cb7',
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
        this.SWAP_FEES.forEach((swapFee) => {
          pools.push({ token0: t0, token1: t1, swapFee })
        })
      }
    }

    const poolState = await this.client
      .multicall({
        allowFailure: true,
        contracts: pools.map(
          pool =>
            ({
              args: [
                this.factory[this.chainId] as Address,
                pool.token0.address as Address,
                pool.token1.address as Address,
                pool.swapFee * 1000000,
                this.BIT_AMOUNT,
                this.BIT_AMOUNT,
              ],
              address: this.stateMultiCall[this.chainId] as Address,
              chainId: chainsParachainIdToChainId[this.chainId],
              abi: uniswapV3StateMulticall,
              functionName: 'getFullStateWithRelativeBitmaps',
            } as const),
        ),
      })

    const ticksMap = new Map<string, { index: number; value: bigint }[]>()
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

      const address = poolState[i].result?.pool
      const balance0 = poolState[i].result?.balance0
      const balance1 = poolState[i].result?.balance1
      const tick = poolState[i].result?.slot0.tick
      const liquidity = poolState[i].result?.liquidity
      const sqrtPriceX96 = poolState[i].result?.slot0.sqrtPriceX96
      const tickBitmap = ticksMap.get(address || '')

      if (
        !address
        || !tick
        || !liquidity
        || !sqrtPriceX96
        || (!balance0 || BigNumber.from(balance0).lt(BigInt(10 ** pool.token0.decimals)))
        || (!balance1 || BigNumber.from(balance1).lt(BigInt(10 ** pool.token1.decimals)))
        || !tickBitmap
      )
        return

      const ticks: UniV3Tick[] = Array.from(tickBitmap)
        .sort((a, b) => a.index - b.index)
        .map(tick => ({ index: tick.index, DLiquidity: BigNumber.from(tick.value) }))

      const v3pool = new UniV3Pool(
        address,
        pool.token0 as BaseToken,
        pool.token1 as BaseToken,
        pool.swapFee,
        BigNumber.from(balance0),
        BigNumber.from(balance1),
        tick,
        BigNumber.from(liquidity),
        BigNumber.from(sqrtPriceX96),
        ticks,
      )
      const pc = new BeamV3PoolCode(v3pool, this.getPoolProviderName())
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
    return LiquidityProviders.BeamswapV3
  }

  public getPoolProviderName(): string {
    return 'BeamswapV3'
  }
}
