import type { ZenlinkProtocolPrimitivesAssetId } from '@zenlink-interface/format'
import { addressToZenlinkAssetId, zenlinkAssetIdToAddress } from '@zenlink-interface/format'
import { ParachainId } from '@zenlink-interface/chain'
import type { NodePrimitivesCurrency } from '../../types'
import { pairAddressToAssets } from '../constants'
import { parseNodePrimitivesCurrency as bifrostParseNodePrimitivesCurrency } from '../../../bifrost/libs/formats/currency'

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

export function parseSymbolOrIndexToIndex(symbolIndex: string | number) {
  return symbolIndex as number
}

export function parseNodePrimitivesCurrency(asset: ZenlinkProtocolPrimitivesAssetId): NodePrimitivesCurrency {
  const { chainId, assetIndex } = asset

  if (chainId === ParachainId.BIFROST_KUSAMA || chainId === ParachainId.BIFROST_POLKADOT)
    return bifrostParseNodePrimitivesCurrency(asset)

  const assetTypeU8 = parseAssetU8(assetIndex)
  const assetSymbol = parseAssetType(assetIndex)
  const nodeCurrencyId = NodeCurrencyId[assetTypeU8]

  if (!nodeCurrencyId)
    throw new Error('invalid asset')

  // LPToken
  if (nodeCurrencyId === 'ZenlinkLPToken') {
    const [asset0, asset1] = pairAddressToAssets[zenlinkAssetIdToAddress(asset)]
    const asset0Type = parseAssetType(asset0.assetIndex).toString()
    const asset0U8 = parseAssetU8(asset0.assetIndex)
    const asset1Type = parseAssetType(asset1.assetIndex).toString()
    const asset1U8 = parseAssetU8(asset1.assetIndex)
    return {
      [nodeCurrencyId]: [
        asset0Type,
        asset0U8,
        asset1Type,
        asset1U8,
      ],
    }
  }

  return { [nodeCurrencyId]: assetSymbol }
}

export function addressToNodeCurrency(address: string): NodePrimitivesCurrency {
  return parseNodePrimitivesCurrency(addressToZenlinkAssetId(address))
}

export function nodePrimitiveCurrencyToZenlinkProtocolPrimitivesAssetId(currency: NodePrimitivesCurrency | string, chainId: number): ZenlinkProtocolPrimitivesAssetId {
  if (currency === 'Native') {
    return {
      chainId,
      assetType: 0,
      assetIndex: 0,
    }
  }

  const [tokenType, tokenSymbol] = Object.entries(currency)[0]
  const tokenIndex = parseToTokenIndex(
    NodeCurrencyIdType[tokenType] as number,
    parseSymbolOrIndexToIndex(tokenSymbol as string),
  )
  return {
    chainId,
    assetType: 2,
    assetIndex: tokenIndex,
  }
}
