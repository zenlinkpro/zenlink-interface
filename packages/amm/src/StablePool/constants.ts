import { ParachainId } from '@zenlink-interface/chain'

export const STABLE_POOL_ADDRESS: Record<string | number, string[]> = {
  [ParachainId.MOONBEAM]: [
    '0x68bed2c54Fd0e6Eeb70cFA05723EAE7c06805EC5', // 4pool
  ],
  [ParachainId.ASTAR]: [
    '0xb0Fa056fFFb74c0FB215F86D691c94Ed45b686Aa', // 4pool
  ],
  [ParachainId.MOONRIVER]: [
    '0x7BDE79AD4ae9023AC771F435A1DC6efdF3F434D1', // 4pool
  ],
}

export const STABLE_LP_OVERRIDE: Record<string | number, Record<string, Record<string, string>>> = {
  [ParachainId.MOONBEAM]: {
    '0xF3821FD2d235eC6C9DB633947A89A16e11a9c1A9': {
      symbol: '4pool',
      name: 'madUSDT/madUSDC/xcaUSD/FRAX',
    },
  },
  [ParachainId.ASTAR]: {
    '0x755cbAC2246e8219e720591Dd362a772076ab653': {
      symbol: '4pool',
      name: 'USDC/BUSD/BAI/DAI',
    },
  },
  [ParachainId.MOONRIVER]: {
    '0x569B9459Db9bcd5964f0c9BdBAA2416722A4bD1a': {
      symbol: '4pool',
      name: 'USDT/USDC/xcAUSD/FRAX',
    },
  },
}
