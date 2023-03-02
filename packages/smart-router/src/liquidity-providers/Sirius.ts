import { ParachainId } from '@zenlink-interface/chain'
import type { ethers } from 'ethers'
import type { Limited } from '../entities'
import type { MultiCallProvider } from '../MultiCallProvider'
import { LiquidityProviders } from './LiquidityProvider'
import { SaddleBaseProvider } from './SaddleBase'

export class SiriusProvider extends SaddleBaseProvider {
  basePools: { [chainId: number]: [string, string[], string][] } = {
    [ParachainId.ASTAR]: [
      [
        '0x417E9d065ee22DFB7CC6C63C403600E27627F333', // Celer 4Pool
        [
          '0x6de33698e9e9b787e09d3bd7771ef63557e148bb', // ceDAI
          '0x6a2d262d56735dba19dd70682b39f6be9a931d98', // ceUSDC
          '0x3795c36e7d12a8c252a20c5a7b455f7c57b60283', // ceUSDT
          '0x4bf769b05e832fcdc9053fffbc78ca889acb5e1e', // cdBUSD
        ],
        '0xB6Df5baFdcDCE7AEb49af6172143E1942999ef14',
      ],
    ],
  }

  metaPools: { [chainId: number]: [string, string[], string, string][] } = {}

  public constructor(
    chainDataProvider: ethers.providers.BaseProvider,
    multiCallProvider: MultiCallProvider,
    chainId: ParachainId,
    l: Limited,
  ) {
    super(chainDataProvider, multiCallProvider, chainId, l)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.Sirius
  }

  public getPoolProviderName(): string {
    return 'Sirius'
  }
}
