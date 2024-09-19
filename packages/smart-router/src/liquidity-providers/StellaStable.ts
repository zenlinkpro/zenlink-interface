import type { PublicClient } from 'viem'
import { ParachainId } from '@zenlink-interface/chain'
import { LiquidityProviders } from './LiquidityProvider'
import { SaddleBaseProvider } from './SaddleBase'

export class StellaStableProvider extends SaddleBaseProvider {
  basePools: { [chainId: number]: [string, string[], string][] } = {
    [ParachainId.MOONBEAM]: [
      [
        '0x5C3dC0Ab1Bd70C5cdc8D0865E023164d4d3Fd8eC', // TriPool
        [
          '0x931715FEE2d06333043d11F658C8CE934aC61D0c', // USDC.wh
          '0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d', // xcUSDT
          '0x322E86852e492a7Ee17f28a78c663da38FB33bfb', // FRAX
        ],
        '0x4FB1b0452341ebB0DF325a8286763447dd6F15fF',
      ],
      [
        '0x95953409374e1ed252c6D100E7466E346E3dC5b9', //  USDC Pool
        [
          '0xCa01a1D0993565291051daFF390892518ACfAD3A', // axlUSDC
          '0x931715FEE2d06333043d11F658C8CE934aC61D0c', // USDC.wh
        ],
        '0x6cd1c3807dbb49785b86cf006fe2c90287c183b2',
      ],
    ],
  }

  metaPools: { [chainId: number]: [string, string[], string, string][] } = {}

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.StellaStable
  }

  public getPoolProviderName(): string {
    return 'StellaStable'
  }
}
