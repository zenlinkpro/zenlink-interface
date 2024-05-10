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

// stDOT-AUG2024
export const SY_stDOT_AUG2024 = new StDOT(
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

export const PT_stDOT_AUG2024 = new PT(
  {
    chainId: ParachainId.MOONBEAM,
    address: '0x3Aa6Ac948057A0a4cb68C39E074234d8d4B9D1d1',
    decimals: 10,
    symbol: 'PT stDOT',
    name: 'PT stDOT 08AUG2024',
  },
  SY_stDOT_AUG2024,
  JSBI.BigInt(1723075200),
)

export const YT_stDOT_AUG2024 = new YT(
  {
    chainId: ParachainId.MOONBEAM,
    address: '0xF6ABF092e32e03d2B0912ED1452D43D7b25A08DA',
    decimals: 10,
    symbol: 'YT stDOT',
    name: 'YT stDOT 08AUG2024',
  },
  SY_stDOT_AUG2024,
  PT_stDOT_AUG2024,
  JSBI.BigInt(1723075200),
)
