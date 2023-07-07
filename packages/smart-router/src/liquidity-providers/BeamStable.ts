import { ParachainId } from '@zenlink-interface/chain'
import type { PublicClient } from 'viem'
import { LiquidityProviders } from './LiquidityProvider'
import { SaddleBaseProvider } from './SaddleBase'

export class BeamStableProvider extends SaddleBaseProvider {
  basePools: { [chainId: number]: [string, string[], string][] } = {
    [ParachainId.MOONBEAM]: [
      [
        '0xE3f59aB3c37c33b6368CDF4f8AC79644011E402C', //  3pool
        [
          '0x931715FEE2d06333043d11F658C8CE934aC61D0c', // USDC.wh
          '0xCa01a1D0993565291051daFF390892518ACfAD3A', // axlUSDC
          '0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d', // xcUSDT
        ],
        '0x89cf45bbe0850c7b0d315a48730f6a602420f8be',
      ],
    ],
  }

  metaPools: { [chainId: number]: [string, string[], string, string][] } = {}

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.BeamStable
  }

  public getPoolProviderName(): string {
    return 'BeamStable'
  }
}
