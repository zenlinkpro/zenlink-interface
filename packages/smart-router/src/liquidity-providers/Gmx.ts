import { BigNumber } from '@ethersproject/bignumber'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Token } from '@zenlink-interface/currency'
import type { Address, PublicClient } from 'viem'
import { balanceOfAbi, gmxVault } from '../abis'
import type { PoolCode } from '../entities'
import { GmxPool, GmxPoolCode } from '../entities'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

export class GmxProvider extends LiquidityProvider {
  public poolCodes: PoolCode[] = []
  private unwatchBlockNumber?: () => void
  public readonly initialPools: Map<string, GmxPool> = new Map()
  public readonly vault: { [chainId: number]: Address } = {}
  public readonly tokens: Token[] = []

  public constructor(
    chainId: ParachainId,
    client: PublicClient,
    vault: { [chainId: number]: Address },
  ) {
    super(chainId, client)
    this.vault = vault
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

    const balanceOfCalls = this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address as Address,
        allowFailure: true,
        contracts: tokens.map(
          token =>
            ({
              args: [this.vault[this.chainId] as Address],
              address: token.address as Address,
              chainId: this.chainId,
              abi: balanceOfAbi,
              functionName: 'balanceOf',
            }),
        ),
      })
      .catch((e) => {
        console.warn(`${e.message}`)
        return undefined
      })

    return await Promise.all([tokenMaxPriceCalls, tokenMinPriceCalls, balanceOfCalls])
  }

  public async getPools(tokens: Token[]) {
    if (!(this.chainId in this.vault)) {
      this.lastUpdateBlock = -1
      return
    }

    const [maxPrices, minPrices, balances] = await this._fetchPools(tokens)

    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < tokens.length; j++) {
        const t0 = tokens[i]
        const t1 = tokens[j]
        const balance0 = balances?.[i].result
        const balance1 = balances?.[j].result
        const token0MaxPrice = maxPrices?.[i].result
        const token0MinPrice = minPrices?.[i].result
        const token1MaxPrice = maxPrices?.[j].result
        const token1MinPrice = minPrices?.[j].result

        if (
          maxPrices?.[i].status !== 'success' || !token0MaxPrice
          || maxPrices?.[j].status !== 'success' || !token1MaxPrice
          || minPrices?.[i].status !== 'success' || token0MinPrice
          || minPrices?.[j].status !== 'success' || !token1MinPrice
          || balances?.[i].status !== 'success' || !balance0
          || balances?.[j].status !== 'success' || !balance1
        ) return

        const pool = new GmxPool(
          this.vault[this.chainId],
          t0,
          t1,
          0.003, // Todo: normal tokens and stable tokens
          BigNumber.from(balance0),
          BigNumber.from(balance1),
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
    if (!this.poolCodes.length)
      return

    const [maxPrices, minPrices, balances] = await this._fetchPools(this.tokens)

    for (let i = 0; i < this.tokens.length; i++) {
      for (let j = i + 1; j < this.tokens.length; j++) {
        const t0 = this.tokens[i]
        const t1 = this.tokens[j]
        const balance0 = balances?.[i].result
        const balance1 = balances?.[j].result
        const token0MaxPrice = maxPrices?.[i].result
        const token0MinPrice = minPrices?.[i].result
        const token1MaxPrice = maxPrices?.[j].result
        const token1MinPrice = minPrices?.[j].result

        if (
          maxPrices?.[i].status !== 'success' || !token0MaxPrice
          || maxPrices?.[j].status !== 'success' || !token1MaxPrice
          || minPrices?.[i].status !== 'success' || token0MinPrice
          || minPrices?.[j].status !== 'success' || !token1MinPrice
          || balances?.[i].status !== 'success' || !balance0
          || balances?.[j].status !== 'success' || !balance1
        ) return

        const pool = this.initialPools.get(`${t0.address}-${t1.address}`)
        if (pool) {
          pool.updateState(
            BigNumber.from(balance0),
            BigNumber.from(balance1),
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
    this.getPools(this.tokens) // starting the process
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
    await this.getPools(this.tokens)
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
