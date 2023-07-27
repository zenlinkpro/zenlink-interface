import { ParachainId } from '@zenlink-interface/chain'
import type { PublicClient } from 'viem'
import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class StellaSwapV2Provider extends UniswapV2BaseProvider {
  factory = {
    [ParachainId.MOONBEAM]: '0x68A384D826D3678f78BB9FB1533c7E9577dACc0E',
  } as const

  initCodeHash = {
    [ParachainId.MOONBEAM]: '0x48a6ca3d52d0d0a6c53a83cc3c8688dd46ea4cb786b169ee959b95ad30f61643',
  } as const

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.StellaSwapV2
  }

  public getPoolProviderName(): string {
    return 'StellaSwapV2'
  }
}
