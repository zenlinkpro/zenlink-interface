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
    networkId: 300,
    address: '0xffffffffa922fef94566104a6e5a35a4fcddaa9f',
    chainId: 2004,
    ethereumChainId: 1284,
    assetType: 255,
    assetIndex: 0,
    symbol: 'ACA',
    decimals: 12,
    name: 'Acala',
  },
  [TokenSymbol.DOT]: {
    networkId: 300,
    address: '0xffffffff1fcacbd218edc0eba20fc2308c778080',
    chainId: 2004,
    ethereumChainId: 1284,
    assetType: 255,
    assetIndex: 0,
    symbol: 'DOT',
    decimals: 10,
    name: 'DOT',
  },
  [TokenSymbol.USDT]: {
    networkId: 200,
    address: '0xb44a9b6905af7c801311e8f4e76932ee959c663c',
    chainId: 2023,
    ethereumChainId: 1285,
    assetType: 255,
    assetIndex: 0,
    symbol: 'USDT',
    decimals: 6,
    name: 'Tether USD',
  },
  [TokenSymbol.KMA]: {
    networkId: 200,
    address: '0xffffffffa083189f870640b141ae1e882c2b5bad',
    chainId: 2023,
    ethereumChainId: 1285,
    assetType: 255,
    assetIndex: 0,
    symbol: 'KMA',
    decimals: 12,
    name: 'Calamari',
  },
  [TokenSymbol.KINT]: {
    networkId: 200,
    address: '0xffffffff83f4f317d3cbf6ec6250aec3697b3ff2',
    chainId: 2023,
    ethereumChainId: 1285,
    assetType: 255,
    assetIndex: 0,
    symbol: 'KINT',
    decimals: 12,
    name: 'Kintsugi Native Token',
  },
  [TokenSymbol.BNC]: {
    networkId: 200,
    address: '2001-0-0',
    chainId: 2001,
    ethereumChainId: 2001,
    assetType: 0,
    assetIndex: 0,
    symbol: 'BNC',
    decimals: 12,
    name: 'Bifrost',
  },
  [TokenSymbol.KAR]: {
    networkId: 200,
    address: '2001-2-518',
    chainId: 2001,
    assetType: 2,
    assetIndex: 518,
    symbol: 'KAR',
    decimals: 12,
    name: 'Karura',
  },

  [TokenSymbol.SDN]: {
    networkId: 200,
    address: '0xffffffff0ca324c842330521525e7de111f38972',
    chainId: 2023,
    ethereumChainId: 1285,
    assetType: 255,
    assetIndex: 0,
    symbol: 'SDN',
    decimals: 18,
    name: 'SDN',
  },
  [TokenSymbol.vsKSM]: {
    networkId: 200,
    address: '2001-2-1028',
    chainId: 2001,
    assetType: 2,
    assetIndex: 1028,
    symbol: 'vsKSM',
    decimals: 12,
    name: 'vsKSM',
  },

  [TokenSymbol.aUSD]: {
    networkId: 200,
    address: '2001-2-770',
    chainId: 2001,
    ethereumChainId: 2001,
    assetType: 2,
    assetIndex: 770,
    symbol: 'aSEED',
    decimals: 12,
    name: 'aUSD SEED',
  },

  [TokenSymbol.KBTC]: {
    networkId: 200,
    address: '2001-2-2050',
    chainId: 2001,
    ethereumChainId: 2001,
    assetType: 2,
    assetIndex: 2050,
    symbol: 'KBTC',
    decimals: 12,
    name: 'KBTC',
  },

  [TokenSymbol.RMRK]: {
    networkId: 200,
    address: '2001-2-521',
    chainId: 2001,
    assetType: 2,
    assetIndex: 521,
    symbol: 'RMRK',
    decimals: 10,
    name: 'RMRK',
  },

  [TokenSymbol.ZLK]: {
    networkId: 200,
    address: '0x0f47ba9d9bde3442b42175e51d6a367928a1173b',
    chainId: 2023,
    assetType: 255,
    assetIndex: 0,
    symbol: 'ZLK',
    decimals: 18,
    name: 'Zenlink Network Token',
  },
  [TokenSymbol.KSM]: {
    networkId: 200,
    address: '2001-2-516',
    chainId: 2001,
    assetType: 2,
    assetIndex: 516,
    symbol: 'KSM',
    decimals: 12,
    name: 'Kusama',
  },
}

export const CROSS_TRANSFER_TOKEN_MAP
  = Object.entries(TOKEN_META)
    .reduce<{ [symbol: string]: Token }>((map, [symbol, meta]) => {
      map[symbol] = new Token(meta)
      return map
    }, {})
