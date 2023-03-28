import type { ParachainId } from '@zenlink-interface/chain'
import type { PublicClient } from 'viem'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV3BaseProvider } from './UniswapV3Base'

export class UniswapV3Provider extends UniswapV3BaseProvider {
  public constructor(chainId: ParachainId, client: PublicClient) {
    const factory = {} as const
    const stateMultiCall = {} as const

    super(chainId, client, factory, stateMultiCall)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.UniswapV3
  }

  public getPoolProviderName(): string {
    return 'UniswapV3'
  }
}
