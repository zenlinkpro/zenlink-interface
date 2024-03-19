import { BigNumber } from '@ethersproject/bignumber'
import { ParachainId, chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { DOT, Token, USDT, WNATIVE } from '@zenlink-interface/currency'
import type { Address, PublicClient } from 'viem'
import { gmxVault } from '../abis'
import type { PoolCode } from '../entities'
import { GmxPool, GmxPoolCode } from '../entities'
import { formatAddress } from '../util'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

const BEAMEX_SWAP_FEE = 0.0025
const BEAMEX_STABLE_SWAP_FEE = 0.0001
const BEAMEX_TAX_FEE = 0.005
const BEAMEX_STABLE_TAX_FEE = 0.0005

export class BeamexProvider extends LiquidityProvider {
  public readonly swapFee = BEAMEX_SWAP_FEE
  public readonly stableSwapFee = BEAMEX_STABLE_SWAP_FEE
  public poolCodes: PoolCode[] = []
  private unwatchBlockNumber?: () => void
  public readonly vault: { [chainId: number]: Address } = {
    [ParachainId.MOONBEAM]: '0x73197B461eA369b36d5ee96A1C9f090Ef512be21',
  }

  public readonly tokens: { [chainId: number]: Token[] } = {
    [ParachainId.MOONBEAM]: [
      WNATIVE[ParachainId.MOONBEAM],
      DOT[ParachainId.MOONBEAM],
      new Token({
        chainId: ParachainId.MOONBEAM,
        address: '0x931715FEE2d06333043d11F658C8CE934aC61D0c',
        decimals: 6,
        symbol: 'USDC.wh',
        name: 'USD Coin (Wormhole)',
      }),
      new Token({
        chainId: ParachainId.MOONBEAM,
        address: '0xe57ebd2d67b462e9926e04a8e33f01cd0d64346d',
        decimals: 8,
        symbol: 'WBTC.wh',
        name: 'Wrapped BTC (Wormhole)',
      }),
      new Token({
        chainId: ParachainId.MOONBEAM,
        address: '0xab3f0245b83feb11d15aaffefd7ad465a59817ed',
        decimals: 18,
        symbol: 'WETH.wh',
        name: 'Wrapped Ether (Wormhole)',
      }),
      USDT[ParachainId.MOONBEAM],
    ],
  }

  public readonly stableTokens: { [chainId: number]: { [address: Address]: boolean } } = {
    [ParachainId.MOONBEAM]: {
      '0x931715FEE2d06333043d11F658C8CE934aC61D0c': true, // USDC.wh
      '0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d': true, // xcUSDT
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
          || poolAmount0 === undefined || poolAmount1 === undefined
          || reservedAmount0 === undefined || reservedAmount1 === undefined
          || maxUsdgAmount0 === undefined || maxUsdgAmount1 === undefined
          || usdgAmount0 === undefined || usdgAmount1 === undefined
        ) continue

        const stableTokens = this.stableTokens[this.chainId]
        const isStablePool = (
          stableTokens[t0.address as Address] || false
        ) && (stableTokens[t1.address as Address] || false)

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
          BEAMEX_SWAP_FEE,
          BEAMEX_STABLE_SWAP_FEE,
          BEAMEX_TAX_FEE,
          BEAMEX_STABLE_TAX_FEE,
        )

        const pc = new GmxPoolCode(pool, this.getPoolProviderName())
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
    return LiquidityProviders.Beamex
  }

  public getPoolProviderName(): string {
    return 'Beamex'
  }
}
