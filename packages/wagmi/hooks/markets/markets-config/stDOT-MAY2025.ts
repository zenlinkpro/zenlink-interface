import { ParachainId } from '@zenlink-interface/chain'
import { Token } from '@zenlink-interface/currency'
import { PT, StDOT, YT } from '@zenlink-interface/market'
import { JSBI } from '@zenlink-interface/math'

const XCDOT = new Token({
  chainId: 2004,
  address: '0xffffffff1fcacbd218edc0eba20fc2308c778080',
  decimals: 10,
  symbol: 'xcDOT',
  name: 'xcDOT',
})

const STDOT = new Token({
  chainId: 2004,
  address: '0xbc7E02c4178a7dF7d3E564323a5c359dc96C4db4',
  decimals: 10,
  symbol: 'stDOT',
  name: 'Stella stDOT',
})

// stDOT-MAY2025
export const SY_stDOT_MAY2025 = new StDOT(
  {
    chainId: ParachainId.MOONBEAM,
    address: '0xa5B63A0a205D5E120921442Ebf059cdd093F392C',
    decimals: 10,
    symbol: 'SY stDOT',
    name: 'SY stDOT',
  },
  XCDOT,
  STDOT,
  [XCDOT, STDOT],
  [STDOT],
)

export const PT_stDOT_MAY2025 = new PT(
  {
    chainId: ParachainId.MOONBEAM,
    address: '0xDfa98Dc63548f254027FAA95fD6CCDfCd557E762',
    decimals: 10,
    symbol: 'PT stDOT',
    name: 'PT stDOT 9MAY2025',
  },
  SY_stDOT_MAY2025,
  JSBI.BigInt(1746748800),
)

export const YT_stDOT_MAY2025 = new YT(
  {
    chainId: ParachainId.MOONBEAM,
    address: '0xdCbD3707E69D90C11b38700386B9834DF0653954',
    decimals: 10,
    symbol: 'YT stDOT',
    name: 'YT stDOT 9MAY2025',
  },
  SY_stDOT_MAY2025,
  PT_stDOT_MAY2025,
  JSBI.BigInt(1746748800),
)
