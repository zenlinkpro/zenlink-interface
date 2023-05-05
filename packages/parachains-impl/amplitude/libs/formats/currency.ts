import type { ZenlinkProtocolPrimitivesAssetId } from '@zenlink-interface/format'
import { addressToZenlinkAssetId } from '@zenlink-interface/format'

export const NodeCurrencyId: Record<number, string> = {
  0: 'Native',
  1: 'XCM',
  2: 'Stellar',
}

export const NodeTokenSymbol: Record<number, string> = {
  0: 'KSM',
  1: 'USDT',
  256: 'XLM',
}

function parseAssetU8(assetIndex: number) {
  return (assetIndex & 0x0000_0000_0000_FF00) >> 8
}

function parseAssetType(assetIndex: number) {
  return assetIndex & 0x0000_0000_0000_000FF
}

export function parseNodePrimitivesCurrency(asset: ZenlinkProtocolPrimitivesAssetId): any {
  const { assetIndex, assetType } = asset

  // Our native asset
  if (assetType === 0) {
    return 'Native'
  }
  else if (assetType === 1) {
    // We don't support asset type 1 yet
    throw new Error('invalid asset')
  }

  if (assetIndex < 256) {
    return { XCM: assetIndex }
  }
  else {
    const tokenSymbol = NodeTokenSymbol[assetIndex]
    if (tokenSymbol === 'XLM') {
      return {
        Stellar: 'StellarNative',
      }
    }
    else {
      // TODO fix me
      const code = ''
      const issuer = ''
      const stellarCurrencyKind = code.length <= 4 ? 'AlphaNum4' : 'AlphaNum12'

      return {
        Stellar: {
          [stellarCurrencyKind]: {
            code,
            issuer,
          },
        },
      }
    }
  }

  // LPToken
  // FIXME
  // if (assetIndex.toString().length === 13) {
  //   const [asset0, asset1] = pairAddressToAssets[zenlinkAssetIdToAddress(asset)]
  //   const asset0U8 = parseAssetU8(asset0.assetIndex)
  //   const asset1U8 = parseAssetU8(asset1.assetIndex)
  //   return {
  //     [nodeCurrencyId]: [
  //       NodeTokenSymbol[parseAssetType(asset0.assetIndex)],
  //       asset0U8,
  //       NodeTokenSymbol[parseAssetType(asset1.assetIndex)],
  //       asset1U8,
  //     ],
  //   }
  // }
}

export function addressToNodeCurrency(address: string): any {
  const result = parseNodePrimitivesCurrency(addressToZenlinkAssetId(address))
  return result
}
