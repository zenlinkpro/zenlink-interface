import type { PublicClient } from 'viem'
import { ParachainId } from '@zenlink-interface/chain'
import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class BaseSwapProvider extends UniswapV2BaseProvider {
  factory = {
    [ParachainId.BASE]: '0xFDa619b6d20975be80A10332cD39b9a4b0FAa8BB',
  } as const

  initCodeHash = {
    [ParachainId.BASE]: '0xb618a2730fae167f5f8ac7bd659dd8436d571872655bcb6fd11f2158c8a64a3b',
  } as const

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.BaseSwap
  }

  public getPoolProviderName(): string {
    return 'BaseSwap'
  }
}
