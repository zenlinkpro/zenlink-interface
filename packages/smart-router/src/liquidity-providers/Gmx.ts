import { BigNumber } from '@ethersproject/bignumber'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Token } from '@zenlink-interface/currency'
import type { Address, PublicClient } from 'viem'
import { gmxVault } from '../abis'
import type { PoolCode } from '../entities'
import { GmxPool, GmxPoolCode } from '../entities'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

export class GmxProvider extends LiquidityProvider {
  public readonly swapFee = 0.003
  public readonly stableSwapFee = 0.0004
  public poolCodes: PoolCode[] = []
  private unwatchBlockNumber?: () => void
  public readonly initialPools: Map<string, GmxPool> = new Map()
  public readonly vault: { [chainId: number]: Address } = {}
  public readonly tokens: { [chainId: number]: Token[] } = {}
  public readonly stableTokens: { [chainId: number]: { [address: Address]: boolean } } = {}

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  private async _fetchPools(tokens: Token[]) {
    const tokenMaxPriceCalls = this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
        allowFailure: true,
        contracts: tokens.map(
          token =>
            ({
              args: [token.address as Address],
              address: this.vault[this.chainId] as Address,
              chainId: this.chainId,
              abi: gmxVault,
              functionName: 'getMaxPrice',
            }),
        ),
      })
      .catch((e) => {
        console.warn(`${e.message}`)
        return undefined
      })

    const tokenMinPriceCalls = this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
        allowFailure: true,
        contracts: tokens.map(
          token =>
            ({
              args: [token.address as Address],
              address: this.vault[this.chainId] as Address,
              chainId: this.chainId,
              abi: gmxVault,
              functionName: 'getMinPrice',
            }),
        ),
      })
      .catch((e) => {
        console.warn(`${e.message}`)
        return undefined
      })

    const reservedAmountsCalls = this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
        allowFailure: true,
        contracts: tokens.map(
          token =>
            ({
              args: [token.address as Address],
              address: this.vault[this.chainId] as Address,
              chainId: this.chainId,
              abi: gmxVault,
              functionName: 'reservedAmounts',
            }),
        ),
      })
      .catch((e) => {
        console.warn(`${e.message}`)
        return undefined
      })

    return await Promise.all([tokenMaxPriceCalls, tokenMinPriceCalls, reservedAmountsCalls])
  }

  public async getPools(tokens: Token[]) {
    if (
      !(this.chainId in this.vault)
      || !(this.chainId in this.tokens)
      || !(this.chainId in this.stableTokens)
    ) {
      this.lastUpdateBlock = -1
      return
    }

    const [maxPrices, minPrices, reserves] = await this._fetchPools(tokens)

    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < tokens.length; j++) {
        const t0 = tokens[i]
        const t1 = tokens[j]
        const reserve0 = reserves?.[i].result
        const reserve1 = reserves?.[j].result
        const token0MaxPrice = maxPrices?.[i].result
        const token0MinPrice = minPrices?.[i].result
        const token1MaxPrice = maxPrices?.[j].result
        const token1MinPrice = minPrices?.[j].result

        if (
          maxPrices?.[i].status !== 'success' || !token0MaxPrice
          || maxPrices?.[j].status !== 'success' || !token1MaxPrice
          || minPrices?.[i].status !== 'success' || token0MinPrice
          || minPrices?.[j].status !== 'success' || !token1MinPrice
          || reserves?.[i].status !== 'success' || !reserve0
          || reserves?.[j].status !== 'success' || !reserve1
        ) return

        const stableTokens = this.stableTokens[this.chainId]
        const isStablePool = stableTokens[t0.address as Address] && stableTokens[t1.address as Address]

        const pool = new GmxPool(
          this.vault[this.chainId],
          t0,
          t1,
          isStablePool ? this.stableSwapFee : this.swapFee,
          BigNumber.from(reserve0),
          BigNumber.from(reserve1),
          BigNumber.from(token0MaxPrice),
          BigNumber.from(token0MinPrice),
          BigNumber.from(token1MaxPrice),
          BigNumber.from(token1MinPrice),
        )
        const pc = new GmxPoolCode(pool, this.getPoolProviderName())
        this.initialPools.set(`${t0.address}_${t1.address}`, pool)
        this.poolCodes.push(pc)
        ++this.stateId
      }
    }
  }

  public async updatePoolsData() {
    if (!this.poolCodes.length || !this.tokens[this.chainId].length)
      return

    const tokens = this.tokens[this.chainId]

    const [maxPrices, minPrices, reserves] = await this._fetchPools(tokens)

    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < tokens.length; j++) {
        const t0 = tokens[i]
        const t1 = tokens[j]
        const reserve0 = reserves?.[i].result
        const reserve1 = reserves?.[j].result
        const token0MaxPrice = maxPrices?.[i].result
        const token0MinPrice = minPrices?.[i].result
        const token1MaxPrice = maxPrices?.[j].result
        const token1MinPrice = minPrices?.[j].result

        if (
          maxPrices?.[i].status !== 'success' || !token0MaxPrice
          || maxPrices?.[j].status !== 'success' || !token1MaxPrice
          || minPrices?.[i].status !== 'success' || token0MinPrice
          || minPrices?.[j].status !== 'success' || !token1MinPrice
          || reserves?.[i].status !== 'success' || !reserve0
          || reserves?.[j].status !== 'success' || !reserve1
        ) return

        const pool = this.initialPools.get(`${t0.address}-${t1.address}`)
        if (pool) {
          pool.updateState(
            BigNumber.from(reserve0),
            BigNumber.from(reserve1),
            BigNumber.from(token0MaxPrice),
            BigNumber.from(token0MinPrice),
            BigNumber.from(token1MaxPrice),
            BigNumber.from(token1MinPrice),
          )
          ++this.stateId
        }
      }
    }
  }

  public startFetchPoolsData() {
    this.stopFetchPoolsData()
    this.poolCodes = []
    this.getPools(this.tokens[this.chainId] || []) // starting the process
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

  public async fetchPoolsForToken(_t0: Token, _t1: Token): Promise<void> {
    await this.getPools(this.tokens[this.chainId] || [])
  }

  public getCurrentPoolList(): PoolCode[] {
    return this.poolCodes
  }

  public stopFetchPoolsData() {
    if (this.unwatchBlockNumber)
      this.unwatchBlockNumber()
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.Gmx
  }

  public getPoolProviderName(): string {
    return 'Gmx'
  }
}
