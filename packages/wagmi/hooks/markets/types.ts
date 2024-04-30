import type { Address } from 'viem'

export enum SwapType {
  NONE,
  ZENLINK,
  // ETH_WETH not used in Aggregator
  ETH_WETH,
}

export interface SwapData {
  swapType: SwapType
  executor: Address
  route: Address
}

export interface TokenInput {
  tokenIn: Address
  netTokenIn: bigint
  tokenMintSy: Address
  zenlinkSwap: Address
  swapData: SwapData
}

export interface TokenOutput {
  tokenOut: Address
  minTokenOut: bigint
  tokenRedeemSy: Address
  zenlinkSwap: Address
  swapData: SwapData
}
