import { Token } from '@zenlink-interface/currency'

type ExtensionValue = string | number | boolean | null | undefined

export interface TokenInfo {
  readonly networkId: number
  readonly chainId: number
  readonly address: string
  readonly assetType: number
  readonly assetIndex: number
  readonly ethereumChainId?: number
  readonly name: string
  readonly decimals: number
  readonly symbol: string
  readonly logoURI?: string
  readonly tags?: string[]
  readonly extensions?: {
    readonly [key: string]: {
      [key: string]: {
        [key: string]: ExtensionValue
      } | ExtensionValue
    } | ExtensionValue
  }
}
export enum TokenSymbol {
  ACA = 'ACA',
  DOT = 'DOT',
  USDT = 'USDT',
  KMA = 'KMA',
  KINT = 'KINT',
  BNC = 'BNC',
  KAR = 'KAR',
  SDN = 'SDN',
  KBTC = 'KBTC',
  vsKSM = 'vsKSM',
  aUSD = 'aUSD',
  RMRK = 'RMRK',
  ZLK = 'ZLK',
  KSM = 'KSM',
}

export const TOKEN_META: Record<TokenSymbol, TokenInfo> = {
  [TokenSymbol.ACA]: {
    address: '0xffffffffa922fef94566104a6e5a35a4fcddaa9f',
    assetIndex: 0,
    assetType: 255,
    chainId: 2004,
    decimals: 12,
    ethereumChainId: 1284,
    name: 'Acala',
    networkId: 300,
    symbol: 'ACA',
  },
  [TokenSymbol.DOT]: {
    address: '0xffffffff1fcacbd218edc0eba20fc2308c778080',
    assetIndex: 0,
    assetType: 255,
    chainId: 2004,
    decimals: 10,
    ethereumChainId: 1284,
    name: 'DOT',
    networkId: 300,
    symbol: 'DOT',
  },
  [TokenSymbol.USDT]: {
    address: '0xb44a9b6905af7c801311e8f4e76932ee959c663c',
    assetIndex: 0,
    assetType: 255,
    chainId: 2023,
    decimals: 6,
    ethereumChainId: 1285,
    name: 'Tether USD',
    networkId: 200,
    symbol: 'USDT',
  },
  [TokenSymbol.KMA]: {
    address: '0xffffffffa083189f870640b141ae1e882c2b5bad',
    assetIndex: 0,
    assetType: 255,
    chainId: 2023,
    decimals: 12,
    ethereumChainId: 1285,
    name: 'Calamari',
    networkId: 200,
    symbol: 'KMA',
  },
  [TokenSymbol.KINT]: {
    address: '0xffffffff83f4f317d3cbf6ec6250aec3697b3ff2',
    assetIndex: 0,
    assetType: 255,
    chainId: 2023,
    decimals: 12,
    ethereumChainId: 1285,
    name: 'Kintsugi Native Token',
    networkId: 200,
    symbol: 'KINT',
  },
  [TokenSymbol.BNC]: {
    address: '2001-0-0',
    assetIndex: 0,
    assetType: 0,
    chainId: 2001,
    decimals: 12,
    ethereumChainId: 2001,
    name: 'Bifrost',
    networkId: 200,
    symbol: 'BNC',
  },
  [TokenSymbol.KAR]: {
    address: '2001-2-518',
    assetIndex: 518,
    assetType: 2,
    chainId: 2001,
    decimals: 12,
    name: 'Karura',
    networkId: 200,
    symbol: 'KAR',
  },

  [TokenSymbol.SDN]: {
    address: '0xffffffff0ca324c842330521525e7de111f38972',
    assetIndex: 0,
    assetType: 255,
    chainId: 2023,
    decimals: 18,
    ethereumChainId: 1285,
    name: 'SDN',
    networkId: 200,
    symbol: 'SDN',
  },
  [TokenSymbol.vsKSM]: {
    address: '2001-2-1028',
    assetIndex: 1028,
    assetType: 2,
    chainId: 2001,
    decimals: 12,
    name: 'vsKSM',
    networkId: 200,
    symbol: 'vsKSM',
  },

  [TokenSymbol.aUSD]: {
    address: '2001-2-770',
    assetIndex: 770,
    assetType: 2,
    chainId: 2001,
    decimals: 12,
    ethereumChainId: 2001,
    name: 'aUSD SEED',
    networkId: 200,
    symbol: 'aSEED',
  },

  [TokenSymbol.KBTC]: {
    address: '2001-2-2050',
    assetIndex: 2050,
    assetType: 2,
    chainId: 2001,
    decimals: 12,
    ethereumChainId: 2001,
    name: 'KBTC',
    networkId: 200,
    symbol: 'KBTC',
  },

  [TokenSymbol.RMRK]: {
    address: '2001-2-521',
    assetIndex: 521,
    assetType: 2,
    chainId: 2001,
    decimals: 10,
    name: 'RMRK',
    networkId: 200,
    symbol: 'RMRK',
  },

  [TokenSymbol.ZLK]: {
    address: '0x0f47ba9d9bde3442b42175e51d6a367928a1173b',
    assetIndex: 0,
    assetType: 255,
    chainId: 2023,
    decimals: 18,
    name: 'Zenlink Network Token',
    networkId: 200,
    symbol: 'ZLK',
  },
  [TokenSymbol.KSM]: {
    address: '2001-2-516',
    assetIndex: 516,
    assetType: 2,
    chainId: 2001,
    decimals: 12,
    name: 'Kusama',
    networkId: 200,
    symbol: 'KSM',
  },
}

export const CROSS_TRANSFER_TOKEN_MAP
  = Object.entries(TOKEN_META)
    .reduce<{ [symbol: string]: Token }>((map, [symbol, meta]) => {
      map[symbol] = new Token(meta)
      return map
    }, {})
