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
      [
        '0xfB911D231A1e671e68aA5F9aa540Ad4305f38409', // xcEQD-xcUSDT
        [
          '0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d', // xcUSDT
          '0xFFffFfFF8cdA1707bAF23834d211B08726B1E499', // xcEQD
        ],
        '0xe026b7d702aaf4b4a53b105e626a7998d4532781',
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
