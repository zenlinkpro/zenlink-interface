import type { ethers } from 'ethers'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Token } from '@zenlink-interface/currency'
import type { Limited, PoolCode } from '../entities'
import type { MultiCallProvider } from '../MultiCallProvider'

export enum LiquidityProviders {
  Zenlink = 'Zenlink',
  StellaSwap = 'StellaSwap',
  Solarbeam = 'Solarbeam',
  ArthSwap = 'ArthSwap',
}

export abstract class LiquidityProvider {
  public readonly limited: Limited
  public readonly chainDataProvider: ethers.providers.BaseProvider
  public readonly multiCallProvider: MultiCallProvider
  public readonly chainId: ParachainId
  public stateId = 0
  public lastUpdateBlock = 0

  public constructor(
    chainDataProvider: ethers.providers.BaseProvider,
    multiCallProvider: MultiCallProvider,
    chainId: ParachainId,
    l: Limited,
  ) {
    this.limited = l
    this.chainDataProvider = chainDataProvider
    this.multiCallProvider = multiCallProvider
    this.chainId = chainId
  }

  public abstract getType(): LiquidityProviders

  // The name of liquidity provider to be used for pool naming
  public abstract getPoolProviderName(): string

  // To start ferch pools data. Can fetch data for the most used or big pools even before
  // to/from tokens are known
  public abstract startFetchPoolsData(): void

  // start fetching pools data for tokens t0, t1, if it is not fetched before
  // call if for to and from tokens
  public abstract fetchPoolsForToken(t0: Token, t1: Token): void

  // Returns current pools data
  public abstract getCurrentPoolList(): PoolCode[]

  // If pools data were changed then stateId should be increased
  public getCurrentPoolStateId(): number {
    return this.stateId
  }

  // Stops all network activity
  public abstract stopFetchPoolsData(): void

  // returns the last processed block number
  public getLastUpdateBlock(): number {
    return this.lastUpdateBlock
  }
}

