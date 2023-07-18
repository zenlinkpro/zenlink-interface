import type { Address, PublicClient } from 'viem'
import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Token } from '@zenlink-interface/currency'
import { BigNumber } from '@ethersproject/bignumber'
import type { BaseToken } from '@zenlink-interface/amm'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@zenlink-interface/router-config'
import type { PoolCode, UniV3Tick } from '../entities'
import { UniV3Pool, UniV3PoolCode } from '../entities'
import { uniswapV3StateMulticall } from '../abis/uniswapV3StateMulticall'
import { formatAddress } from '../util'
import { LiquidityProvider } from './LiquidityProvider'

interface PoolInfo {
  token0: Token
  token1: Token
  swapFee: number
}

export abstract class UniswapV3BaseProvider extends LiquidityProvider {
  public readonly SWAP_FEES = [0.0001, 0.0005, 0.003, 0.01]
  public readonly BIT_AMOUNT = 24
  public poolCodes: PoolCode[] = []

  public readonly initialPools: Map<string, PoolInfo> = new Map()

  private unwatchBlockNumber?: () => void

  public readonly factory: { [chainId: number]: Address } = {}
  public readonly stateMultiCall: { [chainId: number]: Address } = {}

  public constructor(
    chainId: ParachainId,
    client: PublicClient,
    factory: { [chainId: number]: Address },
    stateMultiCall: { [chainId: number]: Address },
  ) {
    super(chainId, client)
    this.factory = factory
    this.stateMultiCall = stateMultiCall
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
      .catch((e) => {
        console.warn(e.message)
        return undefined
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
      const tickBitmap = poolState[i].result?.tickBitmap

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
      const pc = new UniV3PoolCode(v3pool, this.getPoolProviderName())
      this.initialPools.set(address, pool)
      this.poolCodes.push(pc)
      ++this.stateId
    })
  }

  public async updatePoolsData() {
    if (!this.poolCodes.length)
      return

    const poolAddr = new Map<string, UniV3Pool>()
    this.poolCodes.forEach(p => poolAddr.set(p.pool.address, p.pool as UniV3Pool))
    const pools = Array.from(this.initialPools.values())

    const poolState = await this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
        allowFailure: true,
        contracts: pools.map(
          pool =>
            ({
              args: [
                this.factory[this.chainId] as Address,
                pool.token0.address as Address,
                pool.token1.address as Address,
                pool.swapFee * 10000,
                this.BIT_AMOUNT,
                this.BIT_AMOUNT,
              ],
              address: this.stateMultiCall[this.chainId] as Address,
              chainId: this.chainId,
              abi: uniswapV3StateMulticall,
              functionName: 'getFullStateWithRelativeBitmaps',
            } as const),
        ),
      })
      .catch((e) => {
        console.warn(`${e.message}`)
        return undefined
      })

    pools.forEach((_, i) => {
      if (poolState?.[i].status !== 'success' || !poolState?.[i].result)
        return

      const address = poolState[i].result?.pool
      const balance0 = poolState[i].result?.balance0
      const balance1 = poolState[i].result?.balance1
      const tick = poolState[i].result?.slot0.tick
      const liquidity = poolState[i].result?.liquidity
      const sqrtPriceX96 = poolState[i].result?.slot0.sqrtPriceX96

      if (!address || !tick || !liquidity || !sqrtPriceX96 || !balance0 || !balance1)
        return

      const v3pool = poolAddr.get(address)
      if (v3pool) {
        v3pool.updateState(
          BigNumber.from(balance0),
          BigNumber.from(balance1),
          tick,
          BigNumber.from(liquidity),
          BigNumber.from(sqrtPriceX96),
        )
        ++this.stateId
      }
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
        this.updatePoolsData()
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
}
