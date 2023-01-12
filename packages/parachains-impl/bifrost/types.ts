import type { ZenlinkProtocolPrimitivesAssetId } from '@zenlink-interface/format'

export interface NodePrimitivesCurrency {
  [currencyId: string]: string | number | [string, number, string, number]
}

export type PairPrimitivesAssetId = [ZenlinkProtocolPrimitivesAssetId, ZenlinkProtocolPrimitivesAssetId]
