import { BigNumber } from '@ethersproject/bignumber'
import { ParachainId, chainsParachainIdToChainId } from '@zenlink-interface/chain'
import {
  DAI,
  DAI_ADDRESS,
  FRAX,
  FRAX_ADDRESS,
  LINK,
  Token,
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
import { GmxPool, GmxPoolCode } from '../entities'
import { formatAddress } from '../util'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

const BRIDGED_USDC = new Token({
  chainId: ParachainId.ARBITRUM_ONE,
  address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  decimals: 6,
  name: 'USD Coin (Arb1)',
  symbol: 'USDC.e',
})

const GMX_SWAP_FEE = 0.003
const GMX_STABLE_SWAP_FEE = 0.0004
const GMX_TAX_FEE = 0.005
const GMX_STABLE_TAX_FEE = 0.002

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
      BRIDGED_USDC,
    ],
  }

  public readonly stableTokens: { [chainId: number]: { [address: Address]: boolean } } = {
    [ParachainId.ARBITRUM_ONE]: {
      [USDC_ADDRESS[ParachainId.ARBITRUM_ONE]]: true,
      [USDT_ADDRESS[ParachainId.ARBITRUM_ONE]]: true,
      [DAI_ADDRESS[ParachainId.ARBITRUM_ONE]]: true,
      [FRAX_ADDRESS[ParachainId.ARBITRUM_ONE]]: true,
      [BRIDGED_USDC.address]: true,
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

    const poolAmountsCalls = this.client
      .multicall({
        allowFailure: true,
        contracts: tokens.map(
          token =>
            ({
              args: [token.address as Address],
              address: this.vault[this.chainId] as Address,
              chainId: chainsParachainIdToChainId[this.chainId],
              abi: gmxVault,
              functionName: 'poolAmounts',
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

    const usdgAmountsCalls = this.client
      .multicall({
        allowFailure: true,
        contracts: tokens.map(
          token =>
            ({
              args: [token.address as Address],
              address: this.vault[this.chainId] as Address,
              chainId: chainsParachainIdToChainId[this.chainId],
              abi: gmxVault,
              functionName: 'usdgAmounts',
            } as const),
        ),
      })
      .catch((e) => {
        console.warn(`${e.message}`)
        return undefined
      })

    const maxUsdgAmountsCalls = this.client
      .multicall({
        allowFailure: true,
        contracts: tokens.map(
          token =>
            ({
              args: [token.address as Address],
              address: this.vault[this.chainId] as Address,
              chainId: chainsParachainIdToChainId[this.chainId],
              abi: gmxVault,
              functionName: 'maxUsdgAmounts',
            } as const),
        ),
      })
      .catch((e) => {
        console.warn(`${e.message}`)
        return undefined
      })

    return await Promise.all([
      tokenMaxPriceCalls,
      tokenMinPriceCalls,
      poolAmountsCalls,
      reservedAmountsCalls,
      usdgAmountsCalls,
      maxUsdgAmountsCalls,
    ])
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

    // tokens deduplication
    const tokenMap = new Map<string, Token>()
    tokens.forEach(t => tokenMap.set(formatAddress(t.address), t))
    const tokensDedup = Array.from(tokenMap.values())
    // tokens sorting
    const tok0: [string, Token][] = tokensDedup.map(t => [formatAddress(t.address), t])
    tokens = tok0.sort((a, b) => (b[0] > a[0] ? -1 : 1)).map(([_, t]) => t)

    const [
      maxPrices,
      minPrices,
      poolAmounts,
      reservedAmounts,
      usdgAmounts,
      maxUsdgAmounts,
    ] = await this._fetchPools(tokens)

    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < tokens.length; j++) {
        const t0 = tokens[i]
        const t1 = tokens[j]
        const poolAmount0 = poolAmounts?.[i].result
        const poolAmount1 = poolAmounts?.[j].result
        const reservedAmount0 = reservedAmounts?.[i].result
        const reservedAmount1 = reservedAmounts?.[j].result
        const token0MaxPrice = maxPrices?.[i].result
        const token0MinPrice = minPrices?.[i].result
        const token1MaxPrice = maxPrices?.[j].result
        const token1MinPrice = minPrices?.[j].result
        const usdgAmount0 = usdgAmounts?.[i].result
        const usdgAmount1 = usdgAmounts?.[j].result
        const maxUsdgAmount0 = maxUsdgAmounts?.[i].result
        const maxUsdgAmount1 = maxUsdgAmounts?.[j].result

        if (
          maxPrices?.[i].status !== 'success' || !token0MaxPrice
          || maxPrices?.[j].status !== 'success' || !token1MaxPrice
          || minPrices?.[i].status !== 'success' || !token0MinPrice
          || minPrices?.[j].status !== 'success' || !token1MinPrice
          || !poolAmount0 || !poolAmount1
          || !reservedAmount0 || !reservedAmount1
          || !maxUsdgAmount0 || !maxUsdgAmount1
          || !usdgAmount0 || !usdgAmount1
        ) continue

        const stableTokens = this.stableTokens[this.chainId]
        const isStablePool = stableTokens[t0.address as Address] && stableTokens[t1.address as Address]

        const pool = new GmxPool(
          this.vault[this.chainId],
          t0,
          t1,
          isStablePool ? this.stableSwapFee : this.swapFee,
          BigNumber.from(poolAmount0 - reservedAmount0),
          BigNumber.from(poolAmount1 - reservedAmount1),
          BigNumber.from(usdgAmount0),
          BigNumber.from(usdgAmount1),
          BigNumber.from(maxUsdgAmount0),
          BigNumber.from(maxUsdgAmount1),
          BigNumber.from(token0MaxPrice),
          BigNumber.from(token0MinPrice),
          BigNumber.from(token1MaxPrice),
          BigNumber.from(token1MinPrice),
          GMX_SWAP_FEE,
          GMX_STABLE_SWAP_FEE,
          GMX_TAX_FEE,
          GMX_STABLE_TAX_FEE,
        )
        const pc = new GmxPoolCode(pool, this.getPoolProviderName())
        this.initialPools.set(`${t0.address}_${t1.address}`, pool)
        this.poolCodes.push(pc)
        ++this.stateId
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
