import { ParachainId } from '@zenlink-interface/chain'
import type { PublicClient } from 'viem'
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
