import type { Amount, Token } from '@zenlink-interface/currency'
import { JSBI } from '@zenlink-interface/math'
import { Fee } from '../Fee'
import type { MultiPath } from '../MultiRoute'
import type { Pool } from '../Pool'
import { getStableSwapOutputAmount } from './calculations'
import type { StableSwap } from './StableSwap'

export class StablePool implements Pool {
  public readonly swapGasCost = JSBI.BigInt(60000)
  public readonly minLiquidity = JSBI.BigInt(1000)
  public readonly token0: Token
  public readonly token1: Token
  public readonly fee = Fee.MEDIUM
  private readonly _swap: StableSwap
  private readonly _baseSwap?: StableSwap

  constructor(swap: StableSwap, token0: Token, token1: Token, baseSwap?: StableSwap) {
    this.token0 = token0
    this.token1 = token1
    this._swap = swap
    this._baseSwap = baseSwap
  }

  public get chainId(): number {
    return this._swap.chainId
  }

  public get reserve0(): Amount<Token> {
    return this._baseSwap
      ? this._baseSwap.balances[this._baseSwap.getTokenIndex(this.token0)]
      : this._swap.balances[this._swap.getTokenIndex(this.token0)]
  }

  public get reserve1(): Amount<Token> {
    return this._swap.balances[this._swap.getTokenIndex(this.token1)]
  }

  public involvesToken(token: Token): boolean {
    return this._swap.involvesToken(token)
  }

  public pathOf(token: Token): MultiPath {
    return Object.assign(
      {
        stable: true,
        input: token,
        output: token.equals(this.token0) ? this.token1 : this.token0,
        pool: this._swap,
      },
      this._baseSwap
        ? {
            basePool: this._baseSwap,
            fromBase: token.equals(this.token0),
          }
        : {},
    )
  }

  public getOutputAmount(inputAmount: Amount<Token>): [Amount<Token>] {
    const path = this.pathOf(inputAmount.currency)
    return [getStableSwapOutputAmount(path, inputAmount)]
  }
}
