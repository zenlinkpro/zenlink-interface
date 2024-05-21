import { ParachainId } from '@zenlink-interface/chain'
import { Token } from '@zenlink-interface/currency'
import { PT, VDOT, YT } from '@zenlink-interface/market'
import { JSBI } from '@zenlink-interface/math'

const XCDOT = new Token({
  chainId: 2004,
  address: '0xffffffff1fcacbd218edc0eba20fc2308c778080',
  decimals: 10,
  symbol: 'xcDOT',
  name: 'xcDOT',
})

const vDOT = new Token({
  chainId: 2004,
  address: '0xFFFfffFf15e1b7E3dF971DD813Bc394deB899aBf',
  decimals: 10,
  symbol: 'vDOT',
  name: 'Bifrost Voucher DOT',
})

// vDOT-NOV2024
export const SY_vDOT_NOV2024 = new VDOT(
  {
    chainId: ParachainId.MOONBEAM,
    address: '0x7cd0A99F8695574d369fE4e500Ede4bD8639F36f',
    decimals: 10,
    symbol: 'SY vDOT',
    name: 'SY vDOT',
  },
  XCDOT,
  vDOT,
  [vDOT],
  [vDOT],
)

export const PT_vDOT_NOV2024 = new PT(
  {
    chainId: ParachainId.MOONBEAM,
    address: '0xF0da18eABEE2Aa2106DfD484943878d81FB8c504',
    decimals: 10,
    symbol: 'PT vDOT',
    name: 'PT vDOT 21NOV2024',
  },
  SY_vDOT_NOV2024,
  JSBI.BigInt(1734739200),
)

export const YT_vDOT_NOV2024 = new YT(
  {
    chainId: ParachainId.MOONBEAM,
    address: '0x9EE6C9F15435433E30FaEF396F1A49923Ba5FEa8',
    decimals: 10,
    symbol: 'YT vDOT',
    name: 'YT vDOT 21NOV2024',
  },
  SY_vDOT_NOV2024,
  PT_vDOT_NOV2024,
  JSBI.BigInt(1734739200),
)
