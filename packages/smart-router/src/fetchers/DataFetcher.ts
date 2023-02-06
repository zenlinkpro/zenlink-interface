import type { ParachainId } from '@zenlink-interface/chain'
import type { ethers } from 'ethers'
import type { Token, Type } from '@zenlink-interface/currency'
import { Native, WNATIVE } from '@zenlink-interface/currency'
import type { PoolCode } from '../entities'
import { Limited } from '../entities'
import { ArthSwapProvider, LiquidityProviders, NativeWrapProvider, ZenlinkProvider, ZenlinkStableSwapProvider } from '../liquidity-providers'
import type { LiquidityProvider } from '../liquidity-providers'
import { MultiCallProvider } from '../MultiCallProvider'

export class DataFetcher {
  public chainId: ParachainId
  public chainDataProvider: ethers.providers.BaseProvider
  public multiCallProvider: MultiCallProvider
  public limited = new Limited(10, 1000)
  public providers: LiquidityProvider[] = []
  public lastProviderStates: Map<LiquidityProviders, number> = new Map()
  // Provider to poolAddress to PoolCode
  public poolCodes: Map<LiquidityProviders, Map<string, PoolCode>> = new Map()
  public stateId = 0

  public constructor(chainDataProvider: ethers.providers.BaseProvider, chainId: ParachainId) {
    this.chainId = chainId
    this.chainDataProvider = chainDataProvider
    this.multiCallProvider = new MultiCallProvider(chainDataProvider)
  }

  private _providerIsIncluded(lp: LiquidityProviders, liquidity?: LiquidityProviders[]): boolean {
    if (!liquidity)
      return true
    return liquidity.includes(lp)
  }

  public startDataFetching(
    providers?: LiquidityProviders[], // all providers if undefined
  ) {
    this.stopDataFetching()
    this.poolCodes = new Map()

    this.providers = [
      new NativeWrapProvider(this.chainDataProvider, this.multiCallProvider, this.chainId, this.limited),
    ]

    if (this._providerIsIncluded(LiquidityProviders.Zenlink, providers)) {
      this.providers.push(
        new ZenlinkProvider(this.chainDataProvider, this.multiCallProvider, this.chainId, this.limited),
      )
    }
    if (this._providerIsIncluded(LiquidityProviders.ArthSwap, providers)) {
      this.providers.push(
        new ArthSwapProvider(this.chainDataProvider, this.multiCallProvider, this.chainId, this.limited),
      )
    }
    if (this._providerIsIncluded(LiquidityProviders.ZenlinkStableSwap, providers)) {
      this.providers.push(
        new ZenlinkStableSwapProvider(this.chainDataProvider, this.multiCallProvider, this.chainId, this.limited),
      )
    }

    this.providers.forEach(p => p.startFetchPoolsData())
  }

  // To stop fetch pool data
  public stopDataFetching() {
    this.providers.forEach(p => p.stopFetchPoolsData())
  }

  public fetchPoolsForToken(t0: Type, t1: Type) {
    if (t0 instanceof Native)
      t0 = WNATIVE[t0.chainId]
    if (t1 instanceof Native)
      t1 = WNATIVE[t1.chainId]
    this.providers.forEach(p => p.fetchPoolsForToken(t0 as Token, t1 as Token))
  }

  public getCurrentPoolCodeMap(providers?: LiquidityProviders[]): Map<string, PoolCode> {
    const result: Map<string, PoolCode> = new Map()
    this.providers.forEach((p) => {
      if (!this._providerIsIncluded(p.getType(), providers))
        return
      if (p.getCurrentPoolStateId() !== this.lastProviderStates.get(p.getType())) {
        this.lastProviderStates.set(p.getType(), p.getCurrentPoolStateId())
        const poolCodes = p.getCurrentPoolList()
        let pcMap = this.poolCodes.get(p.getType())
        if (pcMap === undefined) {
          pcMap = new Map()
          this.poolCodes.set(p.getType(), pcMap)
        }
        poolCodes.forEach(pc => (pcMap as Map<string, PoolCode>).set(pc.pool.address, pc))
      }
      const pcMap = this.poolCodes.get(p.getType())
      if (pcMap)
        Array.from(pcMap.entries()).forEach(([addr, pc]) => result.set(addr, pc))
    })

    return result
  }

  public getCurrentPoolCodeList(providers?: LiquidityProviders[]): PoolCode[] {
    const pcMap = this.getCurrentPoolCodeMap(providers)
    return Array.from(pcMap.values())
  }

  public getCurrentPoolStateId(providers?: LiquidityProviders[]): number {
    let state = 0
    this.providers.forEach((p) => {
      if (this._providerIsIncluded(p.getType(), providers))
        state += p.getCurrentPoolStateId()
    })
    return state
  }

  // returns the last processed by all LP block number
  public getLastUpdateBlock(providers?: LiquidityProviders[]): number {
    let lastUpdateBlock: number | undefined
    this.providers.forEach((p) => {
      if (this._providerIsIncluded(p.getType(), providers)) {
        const last = p.getLastUpdateBlock()
        if (last < 0)
          return
        if (lastUpdateBlock === undefined)
          lastUpdateBlock = last
        else lastUpdateBlock = Math.min(lastUpdateBlock, last)
      }
    })
    return lastUpdateBlock === undefined ? 0 : lastUpdateBlock
  }
}
