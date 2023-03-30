import type { ParachainId } from '@zenlink-interface/chain'
import type { Token, Type } from '@zenlink-interface/currency'
import { Native, WNATIVE } from '@zenlink-interface/currency'
import type { PublicClient } from 'viem'
import type { PoolCode } from '../entities'
import {
  ArthSwapProvider,
  GmxProvider,
  LiquidityProviders,
  NativeWrapProvider,
  SiriusProvider,
  ZenlinkProvider,
  ZenlinkStableSwapProvider,
} from '../liquidity-providers'
import type { LiquidityProvider } from '../liquidity-providers'

export class DataFetcher {
  public chainId: ParachainId
  public providers: LiquidityProvider[] = []
  public lastProviderStates: Map<LiquidityProviders, number> = new Map()
  // Provider to poolAddress to PoolCode
  public poolCodes: Map<LiquidityProviders, Map<string, PoolCode>> = new Map()
  public stateId = 0
  public client: PublicClient

  public constructor(chainId: ParachainId, client: PublicClient) {
    this.chainId = chainId
    this.client = client
  }

  private _providerIsIncluded(lp: LiquidityProviders, liquidity?: LiquidityProviders[]): boolean {
    if (!liquidity)
      return true
    if (lp === LiquidityProviders.NativeWrap)
      return true
    return liquidity.includes(lp)
  }

  public startDataFetching(
    providers?: LiquidityProviders[], // all providers if undefined
  ) {
    this.stopDataFetching()
    this.poolCodes = new Map()

    this.providers = [
      new NativeWrapProvider(this.chainId, this.client),
    ]

    if (this._providerIsIncluded(LiquidityProviders.Zenlink, providers)) {
      try {
        const provider = new ZenlinkProvider(this.chainId, this.client)
        this.providers.push(provider)
      }
      catch {}
    }

    if (this._providerIsIncluded(LiquidityProviders.ArthSwap, providers)) {
      try {
        const provider = new ArthSwapProvider(this.chainId, this.client)
        this.providers.push(provider)
      }
      catch {}
    }

    if (this._providerIsIncluded(LiquidityProviders.ZenlinkStableSwap, providers)) {
      try {
        const provider = new ZenlinkStableSwapProvider(this.chainId, this.client)
        this.providers.push(provider)
      }
      catch {}
    }

    if (this._providerIsIncluded(LiquidityProviders.Sirius, providers)) {
      try {
        const provider = new SiriusProvider(this.chainId, this.client)
        this.providers.push(provider)
      }
      catch {}
    }

    if (this._providerIsIncluded(LiquidityProviders.Gmx, providers)) {
      try {
        const provider = new GmxProvider(this.chainId, this.client)
        this.providers.push(provider)
      }
      catch {}
    }

    this.providers.forEach(p => p.startFetchPoolsData())
  }

  // To stop fetch pool data
  public stopDataFetching() {
    this.providers.forEach(p => p.stopFetchPoolsData())
  }

  public async fetchPoolsForToken(t0: Type, t1: Type) {
    const token0 = this.transformToken(t0)
    const token1 = this.transformToken(t1)
    await Promise.all(this.providers.map(p => p.fetchPoolsForToken(token0, token1)))
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
        poolCodes.forEach(pc => (pcMap as Map<string, PoolCode>).set(pc.pool.poolId, pc))
      }
      const pcMap = this.poolCodes.get(p.getType())
      if (pcMap)
        Array.from(pcMap.entries()).forEach(([poolId, pc]) => result.set(poolId, pc))
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

  public transformToken(t: Type): Token {
    return t instanceof Native ? WNATIVE[t.chainId] : (t as Token)
  }
}
