import type { ParachainId } from '@zenlink-interface/chain'
import { Native, WNATIVE, WNATIVE_ADDRESS } from '@zenlink-interface/currency'
import type { ethers } from 'ethers'
import type { BaseToken, Limited, PoolCode } from '../entities'
import { NativeWrapPoolCode, NatvieWrapPool } from '../entities'
import type { MultiCallProvider } from '../MultiCallProvider'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

export class NativeWrapProvider extends LiquidityProvider {
  public poolCodes: PoolCode[]

  public constructor(
    chainDataProvider: ethers.providers.BaseProvider,
    multiCallProvider: MultiCallProvider,
    chainId: ParachainId,
    l: Limited,
  ) {
    super(chainDataProvider, multiCallProvider, chainId, l)
    const native = Native.onChain(chainId)
    const nativeToken: BaseToken = {
      address: '',
      name: native.name,
      symbol: native.symbol,
      chainId,
    }
    const bridge = new NatvieWrapPool(
      WNATIVE_ADDRESS[chainId],
      nativeToken,
      WNATIVE[chainId] as BaseToken,
      0,
      50_000,
    )
    this.poolCodes = [new NativeWrapPoolCode(bridge)]
    this.stateId = 0
    this.lastUpdateBlock = -1
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.NativeWrap
  }

  public getPoolProviderName(): string {
    return 'NativeWrap'
  }

  public startFetchPoolsData() {}

  public fetchPoolsForToken(): void {}

  public getCurrentPoolList(): PoolCode[] {
    return this.poolCodes
  }

  public stopFetchPoolsData() {}
}