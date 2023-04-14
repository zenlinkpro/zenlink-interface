import type { BaseToken } from '@zenlink-interface/amm'
import type { BigNumber } from '@ethersproject/bignumber'
import { BasePool } from './BasePool'

const BASE_GAS_CONSUMPTION = 60_000
const STEP_GAS_CONSUMPTION = 20_000

function getSortedBins(activeId: number, bins: JoeV2Bin[]): JoeV2Bin[] {
  const activeBinIndex = bins.findIndex(bin => bin.id === activeId)
  const resBins: JoeV2Bin[] = []

  bins.forEach((bin, index) => {
    if (
      (index < activeBinIndex && bin.id < activeId)
      || (index > activeBinIndex && bin.id > activeId)
    ) return

    resBins.push(bin)
  })
  return resBins
}

export interface JoeV2Bin {
  id: number
  reserve0: BigNumber
  reserve1: BigNumber
}

export interface JoeV2BinWithIndex extends JoeV2Bin {
  index: number
}

export class JoeV2Pool extends BasePool {
  public readonly binStep: number
  public activeId: number
  public readonly totalFee: number
  public bins: JoeV2Bin[]
  public binsMap = new Map<number, JoeV2BinWithIndex>()

  public constructor(
    address: string,
    token0: BaseToken,
    token1: BaseToken,
    fee: number,
    reserve0: BigNumber,
    reserve1: BigNumber,
    totalFee: number,
    binStep: number,
    activeId: number,
    bins: JoeV2Bin[],
  ) {
    super(address, token0, token1, fee, reserve0, reserve1)
    this.binStep = binStep
    this.activeId = activeId
    this.totalFee = totalFee
    this.bins = getSortedBins(activeId, bins)
    this.bins.forEach((bin, index) => this.binsMap.set(bin.id, { ...bin, index }))
  }

  public updateState(
    reserve0: BigNumber,
    reserve1: BigNumber,
    activeId: number,
    bins: JoeV2Bin[],
  ) {
    this.updateReserves(reserve0, reserve1)
    this.activeId = activeId
    this.bins = getSortedBins(activeId, bins)
    this.binsMap.clear()
    this.bins.forEach((bin, index) => this.binsMap.set(bin.id, { ...bin, index }))
  }

  private _getPriceFromId(id: number): number {
    return (1 + this.binStep / 10_000) ** (id - 8388608)
  }

  private _getFeeAmount(amount: number): number {
    const denominator = 1e18 - this.totalFee
    return (amount * this.totalFee + denominator - 1) / denominator
  }

  private _getFeeAmountFrom(amountWithFees: number): number {
    return (amountWithFees * this.totalFee + 1e18 - 1) / 1e18
  }

  public getOutput(amountIn: number, direction: boolean): { output: number; gasSpent: number } {
    let amountInLeft = amountIn
    let id = this.activeId
    let outAmount = 0
    if (this.reserve0.eq(0) || this.reserve1.eq(0))
      return { output: 0, gasSpent: this.swapGasCost }

    let stepCounter = 0
    while (true) {
      const bin = this.binsMap.get(id)
      if (!bin)
        break
      const reserve = direction ? bin.reserve1 : bin.reserve0
      if (!reserve.eq(0)) {
        const price = this._getPriceFromId(id)
        const reserveOut = direction ? parseInt(bin.reserve1.toString()) : parseInt(bin.reserve0.toString())
        let maxAmountIn = direction ? reserveOut / price : reserveOut * price
        const maxFee = this._getFeeAmount(maxAmountIn)
        maxAmountIn += maxFee

        let amountInWithFees: number = amountInLeft
        let fee: number
        let amountOutOfBin: number
        if (amountInLeft >= maxAmountIn) {
          fee = maxFee
          amountInWithFees = maxAmountIn
          amountOutOfBin = reserveOut
        }
        else {
          fee = this._getFeeAmountFrom(amountInWithFees)
          amountOutOfBin = direction ? (amountInWithFees - fee) * price : (amountInWithFees - fee) / price
          if (amountOutOfBin > reserveOut)
            amountOutOfBin = reserveOut
        }

        if (amountInWithFees > 0) {
          amountInLeft -= amountInWithFees
          outAmount += amountOutOfBin
        }
      }

      ++stepCounter
      if (amountInLeft === 0) {
        break
      }
      else {
        const binIndex = bin.index
        const nextBinIndex = direction ? binIndex + 1 : binIndex - 1
        if (nextBinIndex < 0 || nextBinIndex > this.bins.length - 1)
          break
        id = this.bins[nextBinIndex].id
      }
    }

    if (amountInLeft !== 0)
      return { output: 0, gasSpent: this.swapGasCost }
    return { output: outAmount, gasSpent: BASE_GAS_CONSUMPTION + STEP_GAS_CONSUMPTION * stepCounter }
  }

  public getInput(amountOut: number, direction: boolean): { input: number; gasSpent: number } {
    let amountOutLeft = amountOut
    let id = this.activeId
    let inAmount = 0
    if (this.reserve0.eq(0) || this.reserve1.eq(0))
      return { input: Number.POSITIVE_INFINITY, gasSpent: this.swapGasCost }

    let stepCounter = 0
    while (true) {
      const bin = this.binsMap.get(id)
      if (!bin)
        break
      const reserve = direction ? parseInt(bin.reserve1.toString()) : parseInt(bin.reserve0.toString())
      if (reserve > 0) {
        const price = this._getPriceFromId(id)
        const amountOutOfBin = reserve > amountOutLeft ? amountOutLeft : reserve
        const amountInWithoutFee = direction ? amountOutOfBin / price : amountOutOfBin * price
        const fee = this._getFeeAmount(amountInWithoutFee)
        inAmount += amountInWithoutFee + fee
        amountOutLeft -= amountOutOfBin
      }

      ++stepCounter
      if (amountOutLeft === 0) {
        break
      }
      else {
        const binIndex = bin.index
        const nextBinIndex = direction ? binIndex + 1 : binIndex - 1
        if (nextBinIndex < 0 || nextBinIndex > this.bins.length - 1)
          break
        id = this.bins[nextBinIndex].id
      }
    }

    if (amountOutLeft !== 0)
      return { input: Number.POSITIVE_INFINITY, gasSpent: this.swapGasCost }
    return { input: inAmount, gasSpent: BASE_GAS_CONSUMPTION + STEP_GAS_CONSUMPTION * stepCounter }
  }

  public calcCurrentPriceWithoutFee(direction: boolean): number {
    const currentPrice = this._getPriceFromId(this.activeId)
    return direction ? currentPrice : 1 / currentPrice
  }
}
