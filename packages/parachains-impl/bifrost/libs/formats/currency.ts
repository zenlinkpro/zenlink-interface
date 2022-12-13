import type { NodePrimitivesCurrency, ZenlinkProtocolPrimitivesAssetId } from '../../types'

export const NodeCurrencyId: Record<number, string> = {
  0: 'Native',
  1: 'VToken',
  2: 'Token',
  3: 'Stable',
  4: 'VSToken',
  5: 'VSBond',
  6: 'LPToken',
  7: 'ForeignAsset',
  8: 'Token2',
  9: 'VToken2',
  10: 'VSToken2',
  11: 'VSBond2',
  12: 'StableLpToken',
}

export const NodeTokenSymbol: Record<number, string> = {
  0: 'ASG',
  1: 'BNC',
  2: 'KUSD',
  3: 'DOT',
  4: 'KSM',
  5: 'ETH',
  6: 'KAR',
  7: 'ZLK',
  8: 'PHA',
  9: 'RMRK',
  10: 'MOVR',
}

export const TokenType2 = [7, 8, 9, 10, 12]

export function isZenlinkAddress(address: string): boolean {
  return /\d+(-\d+)(-\d+)/.test(address)
}

export function addressToZenlinkAssetId(address: string): ZenlinkProtocolPrimitivesAssetId {
  if (!isZenlinkAddress(address))
    throw new Error('invalid address')
  const [chainId, assetType, assetIndex] = address.split('-')
  return {
    chainId: Number(chainId),
    assetType: Number(assetType),
    assetIndex: Number(assetIndex),
  }
}

export function parseNodePrimitivesCurrency(asset: ZenlinkProtocolPrimitivesAssetId): NodePrimitivesCurrency {
  const { assetType, assetIndex } = asset
  const assetTypeU8 = (assetType & 0x0000_0000_0000_FF00) >> 8
  const nodeCurrencyId = NodeCurrencyId[assetTypeU8]

  if (!nodeCurrencyId)
    throw new Error('invalid asset')

  if (TokenType2.includes(assetTypeU8))
    return { [nodeCurrencyId]: assetIndex & 0x0000_0000_0000_000FF }

  return { [nodeCurrencyId]: NodeTokenSymbol[assetIndex & 0x0000_0000_0000_000FF] }
}

export function addressToNodeCurrency(address: string): NodePrimitivesCurrency {
  return parseNodePrimitivesCurrency(addressToZenlinkAssetId(address))
}
