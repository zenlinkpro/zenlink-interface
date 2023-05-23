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
