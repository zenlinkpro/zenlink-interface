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
      [ParachainId.ARBITRUM_ONE]: '0x3EB05d24f126B581d2335469C0eCF4995d191E21',
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
