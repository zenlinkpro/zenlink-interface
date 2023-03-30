import type { BigNumber } from '@ethersproject/bignumber'
import type { BaseToken } from '@zenlink-interface/amm'

export const TYPICAL_SWAP_GAS_COST = 60_000
export const TYPICAL_MINIMAL_LIQUIDITY = 1000

export function setTokenId(...tokens: BaseToken[]) {
  tokens.forEach((t) => {
    if (!t.tokenId)
      t.tokenId = `${t.address}-${t.chainId}`
  })
}

export abstract class BasePool {
  public readonly poolId: string
  public readonly address: string
  public readonly token0: BaseToken
  public readonly token1: BaseToken
  public readonly fee: number
  public reserve0: BigNumber
  public reserve1: BigNumber
  public readonly minLiquidity: number
  public readonly swapGasCost: number

  public constructor(
    address: string,
    token0: BaseToken,
    token1: BaseToken,
    fee: number,
    reserve0: BigNumber,
    reserve1: BigNumber,
    minLiquidity = TYPICAL_MINIMAL_LIQUIDITY,
    swapGasCost = TYPICAL_SWAP_GAS_COST,
  ) {
    this.address = address
    this.token0 = token0
    this.token1 = token1
    setTokenId(this.token0, this.token1)
    this.poolId = `${address}-${this.token0.tokenId}-${this.token1.tokenId}`
    this.fee = fee
    this.minLiquidity = minLiquidity
    this.swapGasCost = swapGasCost
    this.reserve0 = reserve0
    this.reserve1 = reserve1
  }

  public updateReserves(reserve0: BigNumber, reserve1: BigNumber): void {
    this.reserve0 = reserve0
    this.reserve1 = reserve1
  }

  public getReserve0(): BigNumber {
    return this.reserve0
  }

  public getReserve1(): BigNumber {
    return this.reserve1
  }

  public abstract getOutput(
    amountIn: number,
    direction: boolean
  ): { output: number; gasSpent: number }

  public abstract getInput(
    amountOut: number,
    direction: boolean
  ): { input: number; gasSpent: number }

  public abstract calcCurrentPriceWithoutFee(direction: boolean): number

  public granularity0(): number {
    return 1
  }

  public granularity1(): number {
    return 1
  }

  public alwaysAppropriateForPricing(): boolean {
    return false
  }

  public cleanEffects(): void { }
}
