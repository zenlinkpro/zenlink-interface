export interface TokenPrice {
  id: string,
  priceUSD: number,
  liquidity: number
}

export interface ChainTokenPrice {
  chainId: number,
  tokens: TokenPrice[]
}
