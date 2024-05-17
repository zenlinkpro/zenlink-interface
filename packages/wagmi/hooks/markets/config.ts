import { ParachainId } from '@zenlink-interface/chain'
import { Market, type PT, type SYBase, type YT } from '@zenlink-interface/market'
import type { Address } from 'viem'
import { PT_stDOT_MAY2025, SY_stDOT_MAY2025, YT_stDOT_MAY2025 } from './markets-config/stDOT-MAY2025'

export const MarketEntities: Record<number, Record<Address, Market>> = {
  [ParachainId.MOONBEAM]: {
    // stDOT-MAY2025
    '0xa4D6e4bae0c493E4b01fa751fBA621FC92634645': new Market(
      {
        chainId: ParachainId.MOONBEAM,
        address: '0xa4D6e4bae0c493E4b01fa751fBA621FC92634645',
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
    // stDOT-MAY2025
    '0xa4D6e4bae0c493E4b01fa751fBA621FC92634645': [
      SY_stDOT_MAY2025, // SY
      PT_stDOT_MAY2025, // PT
      YT_stDOT_MAY2025, // YT
    ],
  },
}
