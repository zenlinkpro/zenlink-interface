import { ParachainId } from '@zenlink-interface/chain'
import type { PublicClient } from 'viem'
import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class ArthSwapProvider extends UniswapV2BaseProvider {
  factory = {
    [ParachainId.ASTAR]: '0xA9473608514457b4bF083f9045fA63ae5810A03E',
  } as const

  initCodeHash = {
    [ParachainId.ASTAR]: '0x613b36de6401276e4d938ad0db4063490e66bb3ab2e4aec17cab78a15ea7a0b6',
  } as const

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.ArthSwapV2
  }

  public getPoolProviderName(): string {
    return 'ArthSwapV2'
  }
}
