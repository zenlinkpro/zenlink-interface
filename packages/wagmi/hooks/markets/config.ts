import { ParachainId } from '@zenlink-interface/chain'
import { Market, type PT, type SYBase, type YT } from '@zenlink-interface/market'
import type { Address } from 'viem'
import { PT_vDOT_JUL2025, SY_vDOT_JUL2025, YT_vDOT_JUL2025 } from './markets-config/vDOT-JUL2025'
import { PT_vGLMR_JUL2025, SY_vGLMR_JUL2025, YT_vGLMR_JUL2025 } from './markets-config/vGLMR-JUL2025'

export const MarketEntities: Record<number, Record<Address, Market>> = {
  [ParachainId.MOONBEAM]: {
    // vDOT-JUL2025
    '0x0CFeA99CD5288082222D3FABC16C3E2cdC4f238b': new Market(
      'Bifrost',
      {
        chainId: ParachainId.MOONBEAM,
        address: '0x0CFeA99CD5288082222D3FABC16C3E2cdC4f238b',
        decimals: 18,
        symbol: 'LP vDOT',
        name: 'Zenlink Market LP vDOT',
      },
      PT_vDOT_JUL2025,
    ),
    // vGLMR-JUL2025
    '0xBB415F12bB9eD29fF6F6f3b6DDC40f9723a959c2': new Market(
      'Bifrost',
      {
        chainId: ParachainId.MOONBEAM,
        address: '0xBB415F12bB9eD29fF6F6f3b6DDC40f9723a959c2',
        decimals: 18,
        symbol: 'LP vGLMR',
        name: 'Zenlink Market LP vGLMR',
      },
      PT_vGLMR_JUL2025,
    ),
  },
}

export const YieldTokensEntities: Record<number, Record<Address, [SYBase, PT, YT]>> = {
  [ParachainId.MOONBEAM]: {
    // vDOT-JUL2025
    '0x0CFeA99CD5288082222D3FABC16C3E2cdC4f238b': [
      SY_vDOT_JUL2025,
      PT_vDOT_JUL2025,
      YT_vDOT_JUL2025,
    ],
    // vGLMR-JUL2025
    '0xBB415F12bB9eD29fF6F6f3b6DDC40f9723a959c2': [
      SY_vGLMR_JUL2025,
      PT_vGLMR_JUL2025,
      YT_vGLMR_JUL2025,
    ],
  },
}
