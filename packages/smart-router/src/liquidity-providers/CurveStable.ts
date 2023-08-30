import { ParachainId } from '@zenlink-interface/chain'
import type { PublicClient } from 'viem'
import { LiquidityProviders } from './LiquidityProvider'
import { CurveStableBaseProvider } from './CurveStableBase'

export class CurveStableProvider extends CurveStableBaseProvider {
  basePools: { [chainId: number]: [string, string[], string][] } = {
    [ParachainId.ARBITRUM_ONE]: [
      [
        '0x7f90122BF0700F9E7e1F688fe926940E8839F353', // 2Pool
        [
          '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', // USDC
          '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT
        ],
        '0x7f90122BF0700F9E7e1F688fe926940E8839F353', // 2CRV
      ],
      [
        '0xC9B8a3FDECB9D5b218d02555a8Baf332E5B740d5', //  FRAX BP
        [
          '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F', // FRAX
          '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', // USDC
        ],
        '0xC9B8a3FDECB9D5b218d02555a8Baf332E5B740d5', // FRAXBP
      ],
    ],
    [ParachainId.MOONBEAM]: [
      [
        '0xFF6DD348e6eecEa2d81D4194b60c5157CD9e64f4', // d2o-usdt
        [
          '0xc806B0600cbAfA0B197562a9F7e3B9856866E9bF', // d2o
          '0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d', // usdt
        ],
        '0xFF6DD348e6eecEa2d81D4194b60c5157CD9e64f4', // d2oUSDT-f
      ],
    ],
  }

  metaPools: { [chainId: number]: [string, string[], string, string][] } = {

  }

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.Curve
  }

  public getPoolProviderName(): string {
    return 'Curve'
  }
}
