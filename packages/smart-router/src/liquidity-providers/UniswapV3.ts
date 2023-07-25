import { ParachainId } from '@zenlink-interface/chain'
import type { PublicClient } from 'viem'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV3BaseProvider } from './UniswapV3Base'

export class UniswapV3Provider extends UniswapV3BaseProvider {
  public constructor(chainId: ParachainId, client: PublicClient) {
    const factory = {
      [ParachainId.ARBITRUM_ONE]: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
      [ParachainId.SCROLL_TESTNET]: '0x6E7E0d996eF50E289af9BFd93f774C566F014660',
    } as const
    const stateMultiCall = {
      [ParachainId.ARBITRUM_ONE]: '0x7B1128E610ae1d461B7B8227f9FBBB39e336c515',
      [ParachainId.SCROLL_TESTNET]: '0xAFCCA0f68e0883b797c71525377DE46B2E65AB28',
    } as const

    super(chainId, client, factory, stateMultiCall)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.UniswapV3
  }

  public getPoolProviderName(): string {
    return 'UniswapV3'
  }
}
