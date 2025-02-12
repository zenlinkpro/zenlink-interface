import type { PublicClient } from 'viem'
import { ParachainId } from '@zenlink-interface/chain'

import { AlgebraBaseProvider } from './AlgebraBase'
import { LiquidityProviders } from './LiquidityProvider'

export class StellaSwapV4Provider extends AlgebraBaseProvider {
  public constructor(chainId: ParachainId, client: PublicClient) {
    const factory = {
      [ParachainId.MOONBEAM]: '0x90dD87C994959A36d725bB98F9008B0b3C3504A0',
    } as const
    const stateMultiCall = {
      [ParachainId.MOONBEAM]: '0x5dA55ED94De76E82A4355921504A7eCFEFA2EF00',
    } as const

    super(chainId, client, factory, stateMultiCall)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.StellaSwapV4
  }

  public getPoolProviderName(): string {
    return 'StellaSwapV4'
  }
}
