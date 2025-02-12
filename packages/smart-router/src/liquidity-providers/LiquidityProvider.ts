import type { ParachainId } from '@zenlink-interface/chain'
import type { Token } from '@zenlink-interface/currency'
import type { PublicClient } from 'viem'
import type { PoolCode } from '../entities'

export enum LiquidityProviders {
  MinimalImpl = 'MinimalImpl',
  NativeWrap = 'NativeWrap',
  Zenlink = 'Zenlink',
  ZenlinkStableSwap = 'ZenlinkStableSwap',
  StellaSwapV2 = 'StellaSwapV2',
  StellaSwapV3 = 'StellaSwapV3',
  StellaSwapV4 = 'StellaSwapV4',
  StellaStable = 'StellaStable',
  Solarbeam = 'Solarbeam',
  ArthSwapV2 = 'ArthSwapV2',
  ArthSwapV3 = 'ArthSwapV3',
  Sirius = 'Sirius',
  UniswapV2 = 'UniswapV2',
  UniswapV3 = 'UniswapV3',
  GMX = 'GMX',
  SushiSwap = 'SushiSwap',
  SushiSwapV3 = 'SushiSwapV3',
  TraderJoeV2 = 'TraderJoeV2',
  ZyberswapV3 = 'ZyberswapV3',
  Curve = 'Curve',
  BeamswapV2 = 'BeamswapV2',
  BeamswapV3 = 'BeamswapV3',
  BeamStable = 'BeamStable',
  Beamex = 'Beamex',
  Izumiswap = 'Izumiswap',
  DODOV2 = 'DODOV2',
  Syncswap = 'Syncswap',
  BaseSwap = 'BaseSwap',
  Aerodrome = 'Aerodrome',
  Skydrome = 'Skydrome',
  KyperElastic = 'KyperElastic',
}

export abstract class LiquidityProvider {
  public readonly chainId: ParachainId
  public readonly client: PublicClient
  public stateId = 0
  public lastUpdateBlock = 0

  public constructor(chainId: ParachainId, client: PublicClient) {
    this.chainId = chainId
    this.client = client
  }

  public abstract getType(): LiquidityProviders

  // The name of liquidity provider to be used for pool naming
  public abstract getPoolProviderName(): string

  // To start ferch pools data. Can fetch data for the most used or big pools even before
  // to/from tokens are known
  public abstract startFetchPoolsData(): void

  // start fetching pools data for tokens t0, t1, if it is not fetched before
  // call if for to and from tokens
  public abstract fetchPoolsForToken(t0: Token, t1: Token): Promise<void>

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

export class MinimalImplLiquidityProvider extends LiquidityProvider {
  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public async fetchPoolsForToken(_t0: Token, _t1: Token): Promise<void> {
    await Promise.resolve()
  }

  public getCurrentPoolList(): PoolCode[] {
    return []
  }

  public startFetchPoolsData() {}
  public stopFetchPoolsData() {}

  public getType(): LiquidityProviders {
    return LiquidityProviders.MinimalImpl
  }

  public getPoolProviderName(): string {
    return 'MinimalImpl'
  }
}
