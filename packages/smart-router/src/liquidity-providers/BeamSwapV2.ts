import { ParachainId } from '@zenlink-interface/chain'
import type { PublicClient } from 'viem'
import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class BeamSwapV2Provider extends UniswapV2BaseProvider {
  factory = {
    [ParachainId.MOONBEAM]: '0x985BcA32293A7A496300a48081947321177a86FD',
  } as const

  initCodeHash = {
    [ParachainId.MOONBEAM]: '0xe31da4209ffcce713230a74b5287fa8ec84797c9e77e1f7cfeccea015cdc97ea',
  } as const

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.BeamswapV2
  }

  public getPoolProviderName(): string {
    return 'BeamswapV2'
  }
}
