import { ParachainId } from '@zenlink-interface/chain'

export const WNATIVE_ADDRESS: Record<number | string, string> = {
  [ParachainId.MOONRIVER]: '0x98878B06940aE243284CA214f92Bb71a2b032B8A',
  [ParachainId.MOONBEAM]: '0xAcc15dC74880C9944775448304B263D191c6077F',
  [ParachainId.ASTAR]: '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720',
  [ParachainId.ARBITRUM_ONE]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  [ParachainId.BIFROST_KUSAMA]: '2001-0-0',
  [ParachainId.BIFROST_POLKADOT]: '2030-0-0',
  [ParachainId.SCROLL_ALPHA]: '0xa1EA0B2354F5A344110af2b6AD68e75545009a03',
  [ParachainId.SCROLL]: '0x5300000000000000000000000000000000000004',
  [ParachainId.BASE]: '0x4200000000000000000000000000000000000006',
  [ParachainId.AMPLITUDE]: '2124-0-0',
  [ParachainId.PENDULUM]: '2094-0-0',
}

export const WETH9_ADDRESS: Record<number | string, string> = {
  [ParachainId.ARBITRUM_ONE]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  [ParachainId.BASE]: '0x4200000000000000000000000000000000000006',
  [ParachainId.SCROLL]: '0x5300000000000000000000000000000000000004',
}

export const WBTC_ADDRESS: Record<number | string, string> = {
  [ParachainId.ARBITRUM_ONE]: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  [ParachainId.SCROLL]: '0x3C1BCa5a656e69edCD0D4E36BEbb3FcDAcA60Cf1',
}

export const cbBTC_ADDRESS: Record<number | string, string> = {
  [ParachainId.BASE]: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
}

export const UNI_ADDRESS: Record<number | string, string> = {
  [ParachainId.ARBITRUM_ONE]: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
}

export const ZLK_ADDRESS: Record<number | string, string> = {
  [ParachainId.ASTAR]: '0x998082c488e548820f970df5173bd2061ce90635',
  [ParachainId.MOONRIVER]: '0x0f47ba9d9bde3442b42175e51d6a367928a1173b',
  [ParachainId.MOONBEAM]: '0x3fd9b6c9a24e09f67b7b706d72864aebb439100c',
  [ParachainId.BIFROST_KUSAMA]: '2001-2-519',
  [ParachainId.BIFROST_POLKADOT]: '2030-2-519',
}

export const axlUSDC_ADDRESS = {
  [ParachainId.BASE]: '0xEB466342C4d449BC9f53A865D5Cb90586f405215',
  [ParachainId.SCROLL]: '0xEB466342C4d449BC9f53A865D5Cb90586f405215',
} as const

export const axlDAI_ADDRESS = {
  [ParachainId.BASE]: '0x5C7e299CF531eb66f2A1dF637d37AbB78e6200C7',
} as const

export const USDC_ADDRESS: Record<number | string, string> = {
  [ParachainId.MOONRIVER]: '0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D',
  [ParachainId.ASTAR]: '0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98',
  [ParachainId.ARBITRUM_ONE]: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  [ParachainId.SCROLL_ALPHA]: '0x67aE69Fd63b4fc8809ADc224A9b82Be976039509',
  [ParachainId.SCROLL]: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
  [ParachainId.BASE]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  [ParachainId.AMPLITUDE]: '2124-2-513',
}

export const USDT_ADDRESS: Record<number | string, string> = {
  [ParachainId.MOONRIVER]: '0xB44a9B6905aF7c801311e8F4E76932ee959c663C',
  [ParachainId.ASTAR]: '0xffffffff000000000000000000000001000007c0',
  [ParachainId.ARBITRUM_ONE]: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  [ParachainId.BIFROST_KUSAMA]: '2001-2-2048',
  [ParachainId.SCROLL]: '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df',
  [ParachainId.AMPLITUDE]: '2124-2-257',
}

export const DAI_ADDRESS: Record<number | string, string> = {
  [ParachainId.ASTAR]: '0x6De33698e9e9b787e09d3Bd7771ef63557E148bb',
  [ParachainId.ARBITRUM_ONE]: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  [ParachainId.SCROLL_ALPHA]: '0x4702E5AEb70BdC05B11F8d8E701ad000dc85bD44',
  [ParachainId.BASE]: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  [ParachainId.SCROLL]: '0xcA77eB3fEFe3725Dc33bccB54eDEFc3D9f764f97',
}

export const FRAX_ADDRESS: Record<number | string, string> = {
  [ParachainId.MOONRIVER]: '0x1A93B23281CC1CDE4C4741353F3064709A16197d',
  [ParachainId.MOONBEAM]: '0x322E86852e492a7Ee17f28a78c663da38FB33bfb',
  [ParachainId.ARBITRUM_ONE]: '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F',
}

export const XCAUSD_ADDRESS: Record<number | string, string> = {
  [ParachainId.MOONRIVER]: '0xFfFffFFfa1B026a00FbAA67c86D5d1d5BF8D8228',
  [ParachainId.MOONBEAM]: '0xfFfFFFFF52C56A9257bB97f4B2b6F7B2D624ecda',
  [ParachainId.BIFROST_KUSAMA]: '2001-2-770',
}

export const KSM_ADDRESS: Record<number | string, string> = {
  [ParachainId.BIFROST_KUSAMA]: '2001-2-516',
  [ParachainId.AMPLITUDE]: '2124-2-256',
}

export const DOT_ADDRESS: Record<number | string, string> = {
  [ParachainId.ASTAR]: '0xffffffffffffffffffffffffffffffffffffffff',
  [ParachainId.MOONBEAM]: '0xffffffff1fcacbd218edc0eba20fc2308c778080',
  [ParachainId.BIFROST_POLKADOT]: '2030-2-2048',
  [ParachainId.PENDULUM]: '2094-2-256',
}

export const LINK_ADDRESS: Record<number | string, string> = {
  [ParachainId.ARBITRUM_ONE]: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
}

export const ARB_ADDRESS: Record<number | string, string> = {
  [ParachainId.ARBITRUM_ONE]: '0x912CE59144191C1204E64559FE8253a0e49E6548',
}
