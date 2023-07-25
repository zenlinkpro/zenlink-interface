import { ParachainId, chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Address, PublicClient } from 'viem'
import type { Token } from '@zenlink-interface/currency'
import { BigNumber } from '@ethersproject/bignumber'
import type { BaseToken } from '@zenlink-interface/amm'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from '@zenlink-interface/router-config'
import { type IZiOrders, IZiPool, IZiPoolCode, type IZiState, type PoolCode } from '../entities'
import { formatAddress } from '../util'
import { izumiStateMulticall } from '../abis'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

interface PoolInfo {
  token0: Token
  token1: Token
  swapFee: number
}

export class IZumiSwapProvider extends LiquidityProvider {
  public readonly SWAP_FEES = [0.0001, 0.0004, 0.002, 0.01]
  public readonly OFFSET = 300
  public readonly BATCH_SIZE = 2000
  public poolCodes: PoolCode[] = []

  public readonly initialPools: Map<string, PoolInfo> = new Map()

  private unwatchBlockNumber?: () => void

  public readonly factory: { [chainId: number]: Address } = {
    [ParachainId.SCROLL_TESTNET]: '0x64c2F1306b4ED3183E7B345158fd01c19C0d8c5E',
  }

  public readonly stateMultiCall: { [chainId: number]: Address } = {
    [ParachainId.SCROLL_TESTNET]: '0x624303A1B8244ca766458B127c3C70B753891c39',
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
                this.OFFSET,
                this.BATCH_SIZE,
              ],
              address: this.stateMultiCall[this.chainId] as Address,
              chainId: chainsParachainIdToChainId[this.chainId],
              abi: izumiStateMulticall,
              functionName: 'getFullState',
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
      const pointDelta = poolState[i].result?.pointDelta
      const stateResult = poolState[i].result?.state
      const ordersResult = poolState[i].result?.orders

      if (
        !address
        || (!balance0 || BigNumber.from(balance0).lt(BigInt(10 ** pool.token0.decimals)))
        || (!balance1 || BigNumber.from(balance1).lt(BigInt(10 ** pool.token1.decimals)))
        || !pointDelta
        || !stateResult
        || !ordersResult
      ) return

      const state = {
        sqrtPriceX96: BigNumber.from(stateResult.sqrtPrice_96),
        currentPoint: stateResult.currentPoint,
        liquidity: BigNumber.from(stateResult.liquidity),
        liquidityX: BigNumber.from(stateResult.liquidityX),
      } as IZiState

      const orders = {
        liquidity: ordersResult.allLiquidities.map(l => BigNumber.from(l)),
        liquidityDeltaPoint: ordersResult.allPoint,
        sellingX: ordersResult.sellingX.map(sx => BigNumber.from(sx)),
        sellingXPoint: ordersResult.sellingXPoint,
        sellingY: ordersResult.sellingY.map(sy => BigNumber.from(sy)),
        sellingYPoint: ordersResult.sellingYPoint,
      } as IZiOrders

      const iziPool = new IZiPool(
        address,
        pool.token0 as BaseToken,
        pool.token1 as BaseToken,
        pool.swapFee,
        BigNumber.from(balance0),
        BigNumber.from(balance1),
        state,
        pointDelta,
        orders,
      )

      const pc = new IZiPoolCode(iziPool, this.getPoolProviderName())
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
    return LiquidityProviders.Izumiswap
  }

  public getPoolProviderName(): string {
    return 'Izumiswap'
  }
}
