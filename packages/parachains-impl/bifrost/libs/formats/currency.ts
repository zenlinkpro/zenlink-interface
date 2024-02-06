import type { ZenlinkProtocolPrimitivesAssetId } from '@zenlink-interface/format'
import { addressToZenlinkAssetId, zenlinkAssetIdToAddress } from '@zenlink-interface/format'
import { ParachainId } from '@zenlink-interface/chain'
import type { NodePrimitivesCurrency } from '../../types'
import { pairAddressToAssets } from '../constants'
import { parseNodePrimitivesCurrency as amplitudeParseNodePrimitivesCurrency } from '../../../amplitude/libs/formats/currency'

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

export const NodeCurrencyIdType: Record<string, number> = {
  Native: 0,
  VToken: 1,
  Token: 2,
  Stable: 3,
  VSToken: 4,
  VSBond: 5,
  LPToken: 6,
  ForeignAsset: 7,
  Token2: 8,
  VToken2: 9,
  VSToken2: 10,
  VSBond2: 11,
  StableLpToken: 12,
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

export const NodeTokenSymbolIndex: Record<string, number> = {
  ASG: 0,
  BNC: 1,
  KUSD: 2,
  DOT: 3,
  KSM: 4,
  ETH: 5,
  KAR: 6,
  ZLK: 7,
  PHA: 8,
  RMRK: 9,
  MOVR: 10,
}

export const TokenType2 = [7, 8, 9, 10, 12]

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
  return typeof symbolIndex === 'number' ? symbolIndex : NodeTokenSymbolIndex[symbolIndex]
}

export function parseNodePrimitivesCurrency(asset: ZenlinkProtocolPrimitivesAssetId): NodePrimitivesCurrency {
  const { chainId, assetIndex } = asset

  if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
    return amplitudeParseNodePrimitivesCurrency(asset)

  const assetTypeU8 = parseAssetU8(assetIndex)
  const nodeCurrencyId = NodeCurrencyId[assetTypeU8]

  if (!nodeCurrencyId)
    throw new Error('invalid asset')

  if (TokenType2.includes(assetTypeU8))
    return { [nodeCurrencyId]: parseAssetType(assetIndex) }

  // LPToken
  if (nodeCurrencyId === 'LPToken') {
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
  return parseNodePrimitivesCurrency(addressToZenlinkAssetId(address))
}

export function nodePrimitiveCurrencyToZenlinkProtocolPrimitivesAssetId(currency: NodePrimitivesCurrency, chainId: number): ZenlinkProtocolPrimitivesAssetId {
  const [tokenType, tokenSymbol] = Object.entries(currency)[0]
  const tokenIndex = parseToTokenIndex(
    NodeCurrencyIdType[tokenType] as number,
    parseSymbolOrIndexToIndex(tokenSymbol as string),
  )
  return {
    chainId,
    assetType: tokenIndex === 0 ? 0 : 2,
    assetIndex: tokenIndex,
  }
}
