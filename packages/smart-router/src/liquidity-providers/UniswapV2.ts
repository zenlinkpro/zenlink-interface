import { ParachainId } from '@zenlink-interface/chain'
import type { PublicClient } from 'viem'
import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class UniswapV2Provider extends UniswapV2BaseProvider {
  factory = {
    [ParachainId.BASE]: '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',
  } as const

  initCodeHash = {
    [ParachainId.BASE]: '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
  } as const

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.UniswapV2
  }

  public getPoolProviderName(): string {
    return 'UniswapV2'
  }
}
