export interface NodePrimitivesCurrency {
  [currencyId: string]: string | number
}

export interface ZenlinkProtocolPrimitivesAssetId {
  chainId: number
  assetType: number
  assetIndex: number
}
