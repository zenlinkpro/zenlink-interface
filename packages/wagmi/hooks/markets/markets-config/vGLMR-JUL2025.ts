import { ParachainId } from '@zenlink-interface/chain'
import { Token } from '@zenlink-interface/currency'
import { PT, VGLMR, YT } from '@zenlink-interface/market'
import { JSBI } from '@zenlink-interface/math'

const wGLMR = new Token({
  chainId: 2004,
  address: '0xacc15dc74880c9944775448304b263d191c6077f',
  decimals: 18,
  symbol: 'WGLMR',
  name: 'Wrapped GLMR',
})

const vGLMR = new Token({
  chainId: 2004,
  address: '0xFfFfFFff99dABE1a8De0EA22bAa6FD48fdE96F6c',
  decimals: 18,
  symbol: 'vGLMR',
  name: 'Bifrost Voucher GLMR',
})

// vGLMR-JUL2025
export const SY_vGLMR_JUL2025 = new VGLMR(
  {
    chainId: ParachainId.MOONBEAM,
    address: '0x383a4FBCDDD01f5c4e1Da1Ad42454F210b37D932',
    decimals: 18,
    symbol: 'SY vGLMR',
    name: 'SY vGLMR',
  },
  wGLMR,
  vGLMR,
  [vGLMR],
  [vGLMR],
)

export const PT_vGLMR_JUL2025 = new PT(
  {
    chainId: ParachainId.MOONBEAM,
    address: '0xcC0b3Ccc4C85e791f17A59E5690b80636628a5b3',
    decimals: 18,
    symbol: 'PT vGLMR',
    name: 'PT vGLMR 03JUL2025',
  },
  SY_vGLMR_JUL2025,
  JSBI.BigInt(1751500800),
)

export const YT_vGLMR_JUL2025 = new YT(
  {
    chainId: ParachainId.MOONBEAM,
    address: '0x0A694fceC40025a0E3B5E0485EAaCCE1F651b57f',
    decimals: 18,
    symbol: 'YT vGLMR',
    name: 'YT vGLMR 03JUL2025',
  },
  SY_vGLMR_JUL2025,
  PT_vGLMR_JUL2025,
  JSBI.BigInt(1751500800),
)
