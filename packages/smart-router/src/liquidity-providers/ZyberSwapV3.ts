import { ParachainId } from '@zenlink-interface/chain'
import type { PublicClient } from 'viem'

import { LiquidityProviders } from './LiquidityProvider'
import { AlgebraBaseProvider } from './AlgebraBase'

export class ZyberSwapV3Provider extends AlgebraBaseProvider {
  public constructor(chainId: ParachainId, client: PublicClient) {
    const factory = {
      [ParachainId.ARBITRUM_ONE]: '0x9C2ABD632771b433E5E7507BcaA41cA3b25D8544',
    } as const
    const stateMultiCall = {
      [ParachainId.ARBITRUM_ONE]: '0x41ed2463Fad6B7521F1FA651E5A1Eb47F41b626E',
    } as const

    super(chainId, client, factory, stateMultiCall)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.ZyberswapV3
  }

  public getPoolProviderName(): string {
    return 'ZyberswapV3'
  }
}
