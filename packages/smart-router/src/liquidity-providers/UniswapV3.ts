import { ParachainId } from '@zenlink-interface/chain'
import type { PublicClient } from 'viem'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV3BaseProvider } from './UniswapV3Base'

export class UniswapV3Provider extends UniswapV3BaseProvider {
  public constructor(chainId: ParachainId, client: PublicClient) {
    const factory = {
      [ParachainId.ARBITRUM_ONE]: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
      [ParachainId.SCROLL_ALPHA]: '0x6E7E0d996eF50E289af9BFd93f774C566F014660',
      [ParachainId.BASE]: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
      [ParachainId.MOONBEAM]: '0x28f1158795A3585CaAA3cD6469CD65382b89BB70',
    } as const
    const stateMultiCall = {
      [ParachainId.ARBITRUM_ONE]: '0x4095d49863190Ab7f80EF5c86b0fC988dEF75C84',
      [ParachainId.SCROLL_ALPHA]: '0xAFCCA0f68e0883b797c71525377DE46B2E65AB28',
      [ParachainId.BASE]: '0xbecE3Ff54D129542d28a8aD10DC7C24aB3A0aFAa',
      [ParachainId.MOONBEAM]: '0x9927553354aE0442cd234AB6f88582FA6bc84dC2',
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
