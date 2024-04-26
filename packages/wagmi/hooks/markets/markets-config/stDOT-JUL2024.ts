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

// stDOT-JUL2024
export const SY_stDOT_JUL2024 = new StDOT(
  {
    chainId: ParachainId.MOONBEAM,
    address: '0xa5B63A0a205D5E120921442Ebf059cdd093F392C',
    decimals: 10,
    symbol: 'SY-stDOT',
    name: 'SY stDOT',
  },
  XCDOT,
  STDOT,
  [XCDOT, STDOT],
  [STDOT],
)

export const PT_stDOT_JUL2024 = new PT(
  {
    chainId: ParachainId.MOONBEAM,
    address: '0xe2DB208Ba3bcDD2dD880cEAda853c414594B2Ac7',
    decimals: 10,
    symbol: 'PT-stDOT-22JUL2024',
    name: 'PT stDOT 22JUL2024',
  },
  SY_stDOT_JUL2024,
  JSBI.BigInt(1721606400),
)

export const YT_stDOT_JUL2024 = new YT(
  {
    chainId: ParachainId.MOONBEAM,
    address: '0xCD05C6C8FE8Db5230BbD3A5CC840F62e1181523B',
    decimals: 10,
    symbol: 'YT-stDOT-22JUL2024',
    name: 'YT stDOT 22JUL2024',
  },
  SY_stDOT_JUL2024,
  PT_stDOT_JUL2024,
  JSBI.BigInt(1721606400),
)
