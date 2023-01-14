export interface BaseToken {
  name: string
  symbol: string
  address: string
  chainId: number | string
  tokenId?: string
}
