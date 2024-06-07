import type { BigNumber } from '@ethersproject/bignumber'

import type { BaseToken } from '../../Token'
import type { PoolType } from '../BaseTrade'

export interface RouteLeg {
  poolType: PoolType
  poolId: string
  poolAddress: string // which pool use for swap
  poolFee: number
  protocol?: string

  tokenFrom: BaseToken // from what token to swap
  tokenTo: BaseToken // to what token

  assumedAmountIn: number // assumed number of input token for swapping
  assumedAmountOut: number // assumed number of output token after swapping

  swapPortion: number // for router contract
  absolutePortion: number // to depict at webpage for user
}

export enum RouteStatus {
  Success = 'Success',
  NoWay = 'NoWay',
  Partial = 'Partial',
}

export interface SplitMultiRoute {
  status: RouteStatus
  fromToken: BaseToken
  toToken: BaseToken
  primaryPrice?: number
  swapPrice?: number
  priceImpact?: number
  amountIn: number
  amountInBN: BigNumber
  amountOut: number
  amountOutBN: BigNumber
  legs: RouteLeg[]
  gasSpent: number
  totalAmountOut: number
  totalAmountOutBN: BigNumber
}

export interface NetworkInfo {
  chainId?: number | string
  baseToken: BaseToken
  // current gas price, in baseToken.
  // For example, if gas costs 17Gwei then gasPrice is 17*1e9
  gasPrice: number
}
