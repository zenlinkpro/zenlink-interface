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

enum OrderType {
  SY_FOR_PT,
  PT_FOR_SY,
  SY_FOR_YT,
  YT_FOR_SY,
}

export interface Order {
  salt: bigint
  expiry: bigint
  nonce: bigint
  orderType: OrderType
  token: Address
  YT: Address
  maker: Address
  receiver: Address
  makingAmount: bigint
  lnImpliedRate: bigint
  failSafeRate: bigint
  permit: Address
}

export interface FillOrderParams {
  order: Order
  signature: Address
  makingAmount: bigint
}

export interface LimitOrderData {
  limitRouter: Address
  epsSkipMarket: bigint
  normalFills: FillOrderParams[]
  flashFills: FillOrderParams[]
  optData: Address
}

export interface ApproxParams {
  guessMin: bigint
  guessMax: bigint
  guessOffchain: bigint
  maxIteration: bigint
  eps: bigint
}
