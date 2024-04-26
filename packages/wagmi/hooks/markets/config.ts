import { ParachainId } from '@zenlink-interface/chain'
import { Market, type PT, type SYBase, type YT } from '@zenlink-interface/market'
import type { Address } from 'viem'
import { PT_stDOT_JUL2024, SY_stDOT_JUL2024, YT_stDOT_JUL2024 } from './markets-config/stDOT-JUL2024'

export const MarketContractAddresses: Record<number, Record<Address, Market>> = {
  [ParachainId.MOONBEAM]: {
    // stDOT-JUL2024
    '0xC7949A944Ad76B0f0506891B0e0F480A38992777': new Market(
      {
        chainId: ParachainId.MOONBEAM,
        address: '0xC7949A944Ad76B0f0506891B0e0F480A38992777',
        decimals: 18,
        symbol: 'ZENLINK-LPT',
        name: 'Zenlink Market',
      },
      PT_stDOT_JUL2024,
    ),
  },
}

export const YieldTokensAddresses: Record<number, Record<Address, [SYBase, PT, YT]>> = {
  [ParachainId.MOONBEAM]: {
    // stDOT-JUL2024
    '0xC7949A944Ad76B0f0506891B0e0F480A38992777': [
      SY_stDOT_JUL2024, // SY
      PT_stDOT_JUL2024, // PT
      YT_stDOT_JUL2024, // YT
    ],
  },
}
