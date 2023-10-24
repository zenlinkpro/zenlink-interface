import { ParachainId } from '@zenlink-interface/chain'
import type { PublicClient } from 'viem'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV3BaseProvider } from './UniswapV3Base'

export class SushiV3Provider extends UniswapV3BaseProvider {
  public constructor(chainId: ParachainId, client: PublicClient) {
    const factory = {
      [ParachainId.BASE]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    } as const
    const stateMultiCall = {
      [ParachainId.BASE]: '0x40792858b91D7543A2404936ffbD74CE3900aa6E',
    } as const

    super(chainId, client, factory, stateMultiCall)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.SushiSwapV3
  }

  public getPoolProviderName(): string {
    return 'SushiSwapV3'
  }
}
