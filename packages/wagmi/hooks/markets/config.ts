import { ParachainId } from '@zenlink-interface/chain'
import { Market, type PT, type SYBase, type YT } from '@zenlink-interface/market'
import type { Address } from 'viem'
import { PT_stDOT_MAY2025, SY_stDOT_MAY2025, YT_stDOT_MAY2025 } from './markets-config/stDOT-MAY2025'

export const MarketEntities: Record<number, Record<Address, Market>> = {
  [ParachainId.MOONBEAM]: {
    // stDOT-JUL2024
    // '0xC7949A944Ad76B0f0506891B0e0F480A38992777': new Market(
    //   {
    //     chainId: ParachainId.MOONBEAM,
    //     address: '0xC7949A944Ad76B0f0506891B0e0F480A38992777',
    //     decimals: 18,
    //     symbol: 'LP stDOT',
    //     name: 'Zenlink Market LP stDOT',
    //   },
    //   PT_stDOT_JUL2024,
    // ),
    // stDOT-AUG2024
    // '0x2e1B7d66f73433544015727d8A4a4877255a4d03': new Market(
    //   {
    //     chainId: ParachainId.MOONBEAM,
    //     address: '0x2e1B7d66f73433544015727d8A4a4877255a4d03',
    //     decimals: 18,
    //     symbol: 'LP stDOT',
    //     name: 'Zenlink Market LP stDOT',
    //   },
    //   PT_stDOT_AUG2024,
    // ),
    // stDOT-MAY2025
    '0x530aef30952eb80D389B524EbD9A1CB603bB7911': new Market(
      {
        chainId: ParachainId.MOONBEAM,
        address: '0x530aef30952eb80D389B524EbD9A1CB603bB7911',
        decimals: 18,
        symbol: 'LP stDOT',
        name: 'Zenlink Market LP stDOT',
      },
      PT_stDOT_MAY2025,
    ),
  },
}

export const YieldTokensEntities: Record<number, Record<Address, [SYBase, PT, YT]>> = {
  [ParachainId.MOONBEAM]: {
    // stDOT-JUL2024
    // '0xC7949A944Ad76B0f0506891B0e0F480A38992777': [
    //   SY_stDOT_JUL2024, // SY
    //   PT_stDOT_JUL2024, // PT
    //   YT_stDOT_JUL2024, // YT
    // ],
    // stDOT-AUG2024
    // '0x2e1B7d66f73433544015727d8A4a4877255a4d03': [
    //   SY_stDOT_AUG2024, // SY
    //   PT_stDOT_AUG2024, // PT
    //   YT_stDOT_AUG2024, // YT
    // ],
    // stDOT-MAY2025
    '0x530aef30952eb80D389B524EbD9A1CB603bB7911': [
      SY_stDOT_MAY2025, // SY
      PT_stDOT_MAY2025, // PT
      YT_stDOT_MAY2025, // YT
    ],
  },
}
