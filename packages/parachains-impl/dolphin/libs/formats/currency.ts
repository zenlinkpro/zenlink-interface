import type { ZenlinkProtocolPrimitivesAssetId } from '@zenlink-interface/format'
import { addressToZenlinkAssetId, zenlinkAssetIdToAddress } from '@zenlink-interface/format'
import type { NodePrimitivesCurrency } from '../../types'
import { pairAddressToAssets } from '../constants'

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
  1: 'DOL',
  8: 'DOL8',
  9: 'DOL9',
  10: 'LP10',
}

export const TokenType2 = [7, 8, 9, 10, 12]

function parseAssetU8(assetIndex: number) {
  return (assetIndex & 0x0000_0000_0000_FF00) >> 8
}

function parseAssetType(assetIndex: number) {
  return assetIndex & 0x0000_0000_0000_000FF
}

export function parseNodePrimitivesCurrency(asset: ZenlinkProtocolPrimitivesAssetId): NodePrimitivesCurrency {
  const { assetIndex } = asset
  const assetTypeU8 = parseAssetU8(assetIndex)
  const nodeCurrencyId = NodeCurrencyId[assetTypeU8]

  if (!nodeCurrencyId)
    throw new Error('invalid asset')

  if (TokenType2.includes(assetTypeU8))
    return { [nodeCurrencyId]: parseAssetType(assetIndex) }

  // LPToken
  if (assetIndex.toString().length === 13) {
    const [asset0, asset1] = pairAddressToAssets[zenlinkAssetIdToAddress(asset)]
    const asset0U8 = parseAssetU8(asset0.assetIndex)
    const asset1U8 = parseAssetU8(asset1.assetIndex)
    return {
      [nodeCurrencyId]: [
        NodeTokenSymbol[parseAssetType(asset0.assetIndex)],
        asset0U8,
        NodeTokenSymbol[parseAssetType(asset1.assetIndex)],
        asset1U8,
      ],
    }
  }

  return { [nodeCurrencyId]: NodeTokenSymbol[parseAssetType(assetIndex)] }
}

export function addressToNodeCurrency(address: string): NodePrimitivesCurrency {
  const zenlinkAsset = addressToZenlinkAssetId(address)
  // console.log('zenlink chain:' + zenlinkAsset.chainId + ',type:' + zenlinkAsset.assetType + ',index:' + zenlinkAsset.assetIndex)
  // return parseNodePrimitivesCurrency(zenlinkAsset)
  return { [NodeCurrencyId[zenlinkAsset.assetType]]: NodeTokenSymbol[zenlinkAsset.assetIndex] }
}

export function addressToCurrencyId(address: string): number {
  const zenlinkAsset = addressToZenlinkAssetId(address)
  // console.log('zenlink chain:' + zenlinkAsset.chainId + ',type:' + zenlinkAsset.assetType + ',index:' + zenlinkAsset.assetIndex)
  // return parseNodePrimitivesCurrency(zenlinkAsset)
  return zenlinkAsset.assetIndex
}
