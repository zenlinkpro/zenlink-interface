import { BigNumber } from '@ethersproject/bignumber'
import { ParachainId, chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Token } from '@zenlink-interface/currency'
import {
  DAI,
  DAI_ADDRESS,
  FRAX,
  FRAX_ADDRESS,
  LINK,
  UNI,
  USDC,
  USDC_ADDRESS,
  USDT,
  USDT_ADDRESS,
  WBTC,
  WETH9,
} from '@zenlink-interface/currency'
import type { Address, PublicClient } from 'viem'
import { gmxVault } from '../abis'
import type { PoolCode } from '../entities'
import { GMX_STABLE_SWAP_FEE, GMX_SWAP_FEE, GmxPool, GmxPoolCode } from '../entities'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

export class GmxProvider extends LiquidityProvider {
  public readonly swapFee = GMX_SWAP_FEE
  public readonly stableSwapFee = GMX_STABLE_SWAP_FEE
  public poolCodes: PoolCode[] = []
  private unwatchBlockNumber?: () => void
  public readonly initialPools: Map<string, GmxPool> = new Map()
  public readonly vault: { [chainId: number]: Address } = {
    [ParachainId.ARBITRUM_ONE]: '0x489ee077994B6658eAfA855C308275EAd8097C4A',
  }

  public readonly tokens: { [chainId: number]: Token[] } = {
    [ParachainId.ARBITRUM_ONE]: [
      WETH9[ParachainId.ARBITRUM_ONE],
      WBTC[ParachainId.ARBITRUM_ONE],
      USDC[ParachainId.ARBITRUM_ONE],
      USDT[ParachainId.ARBITRUM_ONE],
      DAI[ParachainId.ARBITRUM_ONE],
      FRAX[ParachainId.ARBITRUM_ONE],
      UNI[ParachainId.ARBITRUM_ONE],
      LINK[ParachainId.ARBITRUM_ONE],
    ],
  }

  public readonly stableTokens: { [chainId: number]: { [address: Address]: boolean } } = {
    [ParachainId.ARBITRUM_ONE]: {
      [USDC_ADDRESS[ParachainId.ARBITRUM_ONE]]: true,
      [USDT_ADDRESS[ParachainId.ARBITRUM_ONE]]: true,
      [DAI_ADDRESS[ParachainId.ARBITRUM_ONE]]: true,
      [FRAX_ADDRESS[ParachainId.ARBITRUM_ONE]]: true,
    },
  }

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  private async _fetchPools(tokens: Token[]) {
    const tokenMaxPriceCalls = this.client
      .multicall({
        allowFailure: true,
        contracts: tokens.map(
          token =>
            ({
              args: [token.address as Address],
              address: this.vault[this.chainId] as Address,
              chainId: chainsParachainIdToChainId[this.chainId],
              abi: gmxVault,
              functionName: 'getMaxPrice',
            } as const),
        ),
      })
      .catch((e) => {
        console.warn(`${e.message}`)
        return undefined
      })

    const tokenMinPriceCalls = this.client
      .multicall({
        allowFailure: true,
        contracts: tokens.map(
          token =>
            ({
              args: [token.address as Address],
              address: this.vault[this.chainId] as Address,
              chainId: chainsParachainIdToChainId[this.chainId],
              abi: gmxVault,
              functionName: 'getMinPrice',
            } as const),
        ),
      })
      .catch((e) => {
        console.warn(`${e.message}`)
        return undefined
      })

    const reservedAmountsCalls = this.client
      .multicall({
        allowFailure: true,
        contracts: tokens.map(
          token =>
            ({
              args: [token.address as Address],
              address: this.vault[this.chainId] as Address,
              chainId: chainsParachainIdToChainId[this.chainId],
              abi: gmxVault,
              functionName: 'reservedAmounts',
            } as const),
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
          || minPrices?.[i].status !== 'success' || !token0MinPrice
          || minPrices?.[j].status !== 'success' || !token1MinPrice
          || reserves?.[i].status !== 'success' || !reserve0
          || reserves?.[j].status !== 'success' || !reserve1
        ) continue

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
          || minPrices?.[i].status !== 'success' || !token0MinPrice
          || minPrices?.[j].status !== 'success' || !token1MinPrice
          || reserves?.[i].status !== 'success' || !reserve0
          || reserves?.[j].status !== 'success' || !reserve1
        ) continue

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
    return LiquidityProviders.GMX
  }

  public getPoolProviderName(): string {
    return 'GMX'
  }
}
