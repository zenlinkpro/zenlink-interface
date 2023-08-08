import type { ZenlinkProtocolPrimitivesAssetId } from '@zenlink-interface/format'
import { addressToZenlinkAssetId, zenlinkAssetIdToAddress } from '@zenlink-interface/format'
import type { NodePrimitivesCurrency } from '../../types'
import { pairAddressToAssets } from '../constants'

export const NodeCurrencyId: Record<number, string> = {
  0: 'Native',
  1: 'XCM',
  2: 'Stellar',
  3: 'ZenlinkLPToken',
}

export const NodeCurrencyIdType: Record<string, number> = {
  Native: 0,
  XCM: 1,
  Stellar: 2,
  ZenlinkLPToken: 3,
}

export const NodeTokenSymbol: Record<number, number> = {
  0: 0,
  1: 1,
}

export const NodeTokenSymbolIndex: Record<number, number> = {
  0: 0,
  1: 1,
}

function parseAssetU8(assetIndex: number) {
  return (assetIndex & 0x0000_0000_0000_FF00) >> 8
}

function parseAssetType(assetIndex: number) {
  return assetIndex & 0x0000_0000_0000_000FF
}

function parseToTokenIndex(type: number, index: number): number {
  if (type === 0)
    return 0

  return (type << 8) + index
}

export const parseSymbolOrIndexToIndex = (symbolIndex: string | number) => {
  // return typeof symbolIndex === 'number' ? symbolIndex : NodeTokenSymbolIndex[symbolIndex]
  return symbolIndex as number
}

export function parseNodePrimitivesCurrency(asset: ZenlinkProtocolPrimitivesAssetId): NodePrimitivesCurrency {
  const { assetIndex } = asset
  const assetTypeU8 = parseAssetU8(assetIndex)
  const nodeCurrencyId = NodeCurrencyId[assetTypeU8]

  if (!nodeCurrencyId)
    throw new Error('invalid asset')

  // LPToken
  if (nodeCurrencyId === 'ZenlinkLPToken') {
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

  const result = { [nodeCurrencyId]: NodeTokenSymbol[parseAssetType(assetIndex)] }


  return { [nodeCurrencyId]: NodeTokenSymbol[parseAssetType(assetIndex)] }
}

export function addressToNodeCurrency(address: string): NodePrimitivesCurrency {
  return parseNodePrimitivesCurrency(addressToZenlinkAssetId(address))
}

export function nodePrimitiveCurrencyToZenlinkProtocolPrimitivesAssetId(currency: NodePrimitivesCurrency, chainId: number): ZenlinkProtocolPrimitivesAssetId {
  const [tokenType, tokenSymbol] = Object.entries(currency)[0]
  const tokenIndex = parseToTokenIndex(
    NodeCurrencyIdType[tokenType] as number,
    parseSymbolOrIndexToIndex(tokenSymbol as string),
  )
  const result = {
    chainId,
    assetType: tokenIndex === 0 ? 0 : 2,
    assetIndex: tokenIndex,
  }
  
  return result
}
