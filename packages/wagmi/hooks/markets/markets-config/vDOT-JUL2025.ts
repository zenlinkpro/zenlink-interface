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

// vDOT-JUL2025
export const SY_vDOT_JUL2025 = new VDOT(
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

export const PT_vDOT_JUL2025 = new PT(
  {
    chainId: ParachainId.MOONBEAM,
    address: '0xe65ef98B01E8B8287C282ecC45Ba15D697c8bEf5',
    decimals: 10,
    symbol: 'PT vDOT',
    name: 'PT vDOT 03JUL2025',
  },
  SY_vDOT_JUL2025,
  JSBI.BigInt(1751500800),
)

export const YT_vDOT_JUL2025 = new YT(
  {
    chainId: ParachainId.MOONBEAM,
    address: '0x1Aa8db3De7818622C253E5Dddf026cA4FAf055Ff',
    decimals: 10,
    symbol: 'YT vDOT',
    name: 'YT vDOT 03JUL2025',
  },
  SY_vDOT_JUL2025,
  PT_vDOT_JUL2025,
  JSBI.BigInt(1751500800),
)
