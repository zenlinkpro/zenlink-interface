import type { BaseToken } from '@zenlink-interface/amm'
import type { BigNumber } from '@ethersproject/bignumber'
import invariant from 'tiny-invariant'
import { getNumber } from '../../util'
import { BasePool } from './BasePool'

enum RState { ONE, ABOVE_ONE, BELOW_ONE }

interface PMMState {
  i: number
  K: number
  B: number
  Q: number
  B0: number
  Q0: number
  R: RState
}

export class DodoV2Pool extends BasePool {
  private readonly state: PMMState
  private readonly lpFeeRate: number
  private readonly mtFeeRate: number
  private readonly midPrice: number

  public constructor(
    address: string,
    token0: BaseToken,
    token1: BaseToken,
    fee: number,
    reserve0: BigNumber,
    reserve1: BigNumber,
    state: PMMState,
    lpFeeRate: BigNumber,
    mtFeeRate: BigNumber,
    midPrice: BigNumber,
  ) {
    super(address, token0, token1, fee, reserve0, reserve1)
    this.state = state
    this.lpFeeRate = getNumber(lpFeeRate)
    this.mtFeeRate = getNumber(mtFeeRate)
    this.midPrice = getNumber(midPrice)
  }

  private solveQuadraticFunctionForTrade(
    v0: number,
    v1: number,
    delta: number,
    i: number,
    k: number,
  ): number {
    invariant(v0 > 0, 'DODOV2: target is zero')
    if (delta === 0)
      return 0

    if (k === 0)
      return (i * delta) / 1e18 > v1 ? v1 : (i * delta) / 1e18

    if (k === 1e18) {
      let temp = 0
      const idelta = i * delta
      if (idelta === 0)
        temp = 0
      else if ((idelta * v1) / idelta === v1)
        temp = (idelta * v1) / (v0 * v0)
      else
        temp = (((delta * v1) / v0) * i) / v0
      return (v1 * temp) / (temp + 1e18)
    }

    const part2 = ((k * v0) / v1) * v0 + (i * delta)
    let bAbs = (1e18 - k) * v1

    let bSig = false
    if (bAbs >= part2) {
      bAbs = bAbs - part2
      bSig = false
    }
    else {
      bAbs = part2 - bAbs
      bSig = true
    }
    bAbs = bAbs / 1e18

    let squareRoot = ((1e18 - k) * 4) * ((k * v0 / 1e18) * v0) / 1e18
    squareRoot = Math.sqrt(bAbs * bAbs + squareRoot)

    const denominator = (1e18 - k) * 2
    let numerator = 0
    if (bSig)
      numerator = squareRoot - bAbs
    else
      numerator = bAbs + squareRoot

    const v2 = numerator * 1e18 / denominator
    if (v2 > v1)
      return 0
    else
      return v1 - v2
  }

  private generalIntegrate(
    v0: number,
    v1: number,
    v2: number,
    i: number,
    k: number,
  ): number {
    invariant(v0 > 0, 'DODOV2: target is zero')
    const fairAmount = i * (v1 - v2)
    if (k === 0)
      return fairAmount / 1e18
    const V0V0V1V2 = ((v0 * v0 / v1) * 1e18) / v2
    const penalty = k * V0V0V1V2 / 1e18
    return ((1e18 - k + penalty) * fairAmount) / 1e36
  }

  private ROneSellBaseToken(st: PMMState, payBaseAmount: number): number {
    return this.solveQuadraticFunctionForTrade(
      st.Q0,
      st.Q0,
      payBaseAmount,
      st.i,
      st.K,
    )
  }

  private ROneSellQuoteToken(st: PMMState, payQuoteAmount: number): number {
    return this.solveQuadraticFunctionForTrade(
      st.B0,
      st.B0,
      payQuoteAmount,
      1e36 / st.i,
      st.K,
    )
  }

  private RBelowSellBaseToken(st: PMMState, payBaseAmount: number): number {
    return this.solveQuadraticFunctionForTrade(
      st.Q0,
      st.Q,
      payBaseAmount,
      st.i,
      st.K,
    )
  }

  private RAboveSellQuoteToken(st: PMMState, payQuoteAmount: number): number {
    return this.solveQuadraticFunctionForTrade(
      st.B0,
      st.B,
      payQuoteAmount,
      1e36 / st.i,
      st.K,
    )
  }

  private RAboveSellBaseToken(st: PMMState, payBaseAmount: number): number {
    return this.generalIntegrate(
      st.B0,
      st.B + payBaseAmount,
      st.B,
      st.i,
      st.K,
    )
  }

  private RBelowSellQuoteToken(st: PMMState, payQuoteAmount: number): number {
    return this.generalIntegrate(
      st.Q0,
      st.Q + payQuoteAmount,
      st.Q,
      1e36 / st.i,
      st.K,
    )
  }

  private sellBaseToken(payBaseAmount: number): { receiveQuoteAmount: number; newR: RState } {
    const st = { ...this.state }
    let receiveQuoteAmount = 0
    let newR: RState
    if (st.R === RState.ONE) {
      receiveQuoteAmount = this.ROneSellBaseToken(st, payBaseAmount)
      newR = RState.BELOW_ONE
    }
    else if (st.R === RState.ABOVE_ONE) {
      const backToOnePayBase = st.B0 - st.B
      const backToOneReceiveQuote = st.Q - st.Q0
      if (payBaseAmount < backToOnePayBase) {
        receiveQuoteAmount = this.RAboveSellBaseToken(st, payBaseAmount)
        newR = RState.ABOVE_ONE
        if (receiveQuoteAmount > backToOneReceiveQuote)
          receiveQuoteAmount = backToOneReceiveQuote
      }
      else if (payBaseAmount === backToOnePayBase) {
        receiveQuoteAmount = backToOneReceiveQuote
        newR = RState.ONE
      }
      else {
        receiveQuoteAmount = backToOneReceiveQuote + this.ROneSellBaseToken(st, payBaseAmount - backToOnePayBase)
        newR = RState.BELOW_ONE
      }
    }
    else {
      receiveQuoteAmount = this.RBelowSellBaseToken(st, payBaseAmount)
      newR = RState.BELOW_ONE
    }
    return { receiveQuoteAmount, newR }
  }

  private sellQuoteToken(payQuoteAmount: number): { receiveBaseAmount: number; newR: RState } {
    const st = { ...this.state }
    let receiveBaseAmount = 0
    let newR: RState
    if (st.R === RState.ONE) {
      receiveBaseAmount = this.ROneSellQuoteToken(st, payQuoteAmount)
      newR = RState.ABOVE_ONE
    }
    else if (st.R === RState.ABOVE_ONE) {
      receiveBaseAmount = this.RAboveSellQuoteToken(st, payQuoteAmount)
      newR = RState.ABOVE_ONE
    }
    else {
      const backToOnePayQuote = st.Q0 - st.Q
      const backToOneReceiveBase = st.B - st.B0
      if (payQuoteAmount < backToOnePayQuote) {
        receiveBaseAmount = this.RBelowSellQuoteToken(st, payQuoteAmount)
        newR = RState.BELOW_ONE
        if (receiveBaseAmount > backToOneReceiveBase)
          receiveBaseAmount = backToOneReceiveBase
      }
      else if (payQuoteAmount === backToOnePayQuote) {
        receiveBaseAmount = backToOneReceiveBase
        newR = RState.ONE
      }
      else {
        receiveBaseAmount = backToOneReceiveBase + this.ROneSellQuoteToken(st, payQuoteAmount - backToOnePayQuote)
        newR = RState.ABOVE_ONE
      }
    }
    return { receiveBaseAmount, newR }
  }

  public getOutput(amountIn: number, direction: boolean): { output: number; gasSpent: number } {
    let receiveAmount = direction
      ? this.sellQuoteToken(amountIn).receiveBaseAmount
      : this.sellBaseToken(amountIn).receiveQuoteAmount
    const mtFee = receiveAmount * this.mtFeeRate / 1e18
    receiveAmount = receiveAmount - (receiveAmount * this.lpFeeRate / 1e18) - mtFee
    const reserve = direction ? getNumber(this.reserve1) : getNumber(this.reserve0)
    if (receiveAmount >= reserve)
      return { output: reserve - 1, gasSpent: this.swapGasCost }
    return { output: receiveAmount, gasSpent: this.swapGasCost }
  }

  public getInput(_amountOut: number, _direction: boolean): { input: number; gasSpent: number } {
    return { input: Number.POSITIVE_INFINITY, gasSpent: this.swapGasCost }
  }

  public calcCurrentPriceWithoutFee(direction: boolean): number {
    return direction ? this.midPrice / 1e18 : 1 / (this.midPrice / 1e18)
  }
}
