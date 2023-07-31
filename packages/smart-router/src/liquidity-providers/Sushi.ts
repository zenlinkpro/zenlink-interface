import { ParachainId } from '@zenlink-interface/chain'
import type { PublicClient } from 'viem'
import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class SushiProvider extends UniswapV2BaseProvider {
  factory = {
    [ParachainId.ARBITRUM_ONE]: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
  } as const

  initCodeHash = {
    [ParachainId.ARBITRUM_ONE]: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
  } as const

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.SushiSwap
  }

  public getPoolProviderName(): string {
    return 'SushiSwap'
  }
}
