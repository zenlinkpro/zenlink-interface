import type { BaseToken } from '@zenlink-interface/amm'
import type { ParachainId } from '@zenlink-interface/chain'
import { Native, WNATIVE, WNATIVE_ADDRESS } from '@zenlink-interface/currency'
import type { PublicClient } from 'viem'
import type { PoolCode } from '../entities'
import { NativeWrapPoolCode, NatvieWrapPool } from '../entities'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

export class NativeWrapProvider extends LiquidityProvider {
  public poolCodes: PoolCode[]

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
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

  public async fetchPoolsForToken(): Promise<void> {}

  public getCurrentPoolList(): PoolCode[] {
    return this.poolCodes
  }

  public stopFetchPoolsData() {}
}
