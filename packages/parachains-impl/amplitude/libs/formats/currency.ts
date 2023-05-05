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

  // TODO LP tokens: we don't have a CurrencyId for LP tokens yet
}

export function addressToNodeCurrency(address: string): any {
  const result = parseNodePrimitivesCurrency(addressToZenlinkAssetId(address))
  return result
}
