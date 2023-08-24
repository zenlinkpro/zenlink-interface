import { ParachainId } from '@zenlink-interface/chain'
import type { PublicClient } from 'viem'
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
      [
        '0xEEa640c27620D7C448AD655B6e3FB94853AC01e3', // ASTR/nASTR
        [
          '0xaeaaf0e2c81af264101b9129c00f4440ccf0f720', // WASTR
          '0xe511ed88575c57767bafb72bfd10775413e3f2b0', // nASTR
        ],
        '0xcb274236fba7b873fc8f154bb0475a166c24b119',
      ],
    ],
  }

  metaPools: { [chainId: number]: [string, string[], string, string][] } = {
    [ParachainId.ASTAR]: [
      // [
      //   '0x8e39e47Ca4A44D4316b88727Eb4407De877a9235', // USDT MetaPool
      //   [
      //     '0xffffffff000000000000000000000001000007c0', // USDT
      //     '0xb6df5bafdcdce7aeb49af6172143e1942999ef14', // 4SRS
      //   ],
      //   '0x8e12781da51480d84715ad83ee482643601d843e',
      //   '0x417E9d065ee22DFB7CC6C63C403600E27627F333',
      // ],
    ],
  }

  public constructor(chainId: ParachainId, client: PublicClient) {
    super(chainId, client)
  }

  public getType(): LiquidityProviders {
    return LiquidityProviders.Sirius
  }

  public getPoolProviderName(): string {
    return 'Sirius'
  }
}
