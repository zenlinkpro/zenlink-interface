import { ParachainId } from '@zenlink-interface/chain'
import type { PublicClient } from 'viem'

import { LiquidityProviders } from './LiquidityProvider'
import { AlgebraBaseProvider } from './AlgebraBase'

export class StellaSwapV3Provider extends AlgebraBaseProvider {
  public constructor(chainId: ParachainId, client: PublicClient) {
    const factory = {
      [ParachainId.MOONBEAM]: '0xabE1655110112D0E45EF91e94f8d757e4ddBA59C',
    } as const
    const stateMultiCall = {
      [ParachainId.MOONBEAM]: '0x09c58401cfb944405c67326908F056874300a50b',
    } as const

    super(chainId, client, factory, stateMultiCall)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.StellaSwapV3
  }

  public getPoolProviderName(): string {
    return 'StellaSwapV3'
  }
}
