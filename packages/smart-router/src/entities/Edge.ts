import type { BigNumber } from '@ethersproject/bignumber'
import type { BasePool } from './pools'
import type { Vertice } from './Vertice'
import invariant from 'tiny-invariant'
import { ASSERT, closeValues } from '../util'

export class Edge {
  public readonly pool: BasePool
  public readonly vert0: Vertice
  public readonly vert1: Vertice

  public canBeUsed: boolean
  public direction: boolean
  public amountInPrevious: number // How many liquidity were passed from vert0 to vert1
  public amountOutPrevious: number // How many liquidity were passed from vert0 to vert1
  public spentGas: number // How much gas was spent for this edge
  public spentGasNew: number //  How much gas was will be spent for this edge
  public bestEdgeIncome: number // debug data

  public constructor(pool: BasePool, vert0: Vertice, vert1: Vertice) {
    this.pool = pool
    this.vert0 = vert0
    this.vert1 = vert1
    this.amountInPrevious = 0
    this.amountOutPrevious = 0
    this.canBeUsed = true
    this.direction = true
    this.spentGas = 0
    this.spentGasNew = 0
    this.bestEdgeIncome = 0
  }

  public cleanCache(): void {
    this.amountInPrevious = 0
    this.amountOutPrevious = 0
    this.canBeUsed = true
    this.direction = true
    this.spentGas = 0
    this.spentGasNew = 0
    this.bestEdgeIncome = 0
  }

  public reserve(v: Vertice): BigNumber {
    return v === this.vert0 ? this.pool.getReserve0() : this.pool.getReserve1()
  }

  public getOutput(v: Vertice, amountIn: number): { output: number, gasSpent: number } {
    let res: number
    let gas: number
    if (v === this.vert1) {
      if (this.direction) {
        if (amountIn < this.amountOutPrevious) {
          const { input, gasSpent } = this.pool.getInput(this.amountOutPrevious - amountIn, true)
          res = this.amountInPrevious - input
          gas = gasSpent
        }
        else {
          const { output, gasSpent } = this.pool.getOutput(amountIn - this.amountOutPrevious, false)
          res = output + this.amountInPrevious
          gas = gasSpent
        }
      }
      else {
        const { output, gasSpent } = this.pool.getOutput(this.amountOutPrevious + amountIn, false)
        res = output - this.amountInPrevious
        gas = gasSpent
      }
    }
    else {
      if (this.direction) {
        const { output, gasSpent } = this.pool.getOutput(this.amountInPrevious + amountIn, true)
        res = output - this.amountOutPrevious
        gas = gasSpent
      }
      else {
        if (amountIn < this.amountInPrevious) {
          const { input, gasSpent } = this.pool.getInput(this.amountInPrevious - amountIn, false)
          res = this.amountOutPrevious - input
          gas = gasSpent
        }
        else {
          const { output, gasSpent } = this.pool.getOutput(amountIn - this.amountInPrevious, true)
          res = output + this.amountOutPrevious
          gas = gasSpent
        }
      }
    }

    return { output: res, gasSpent: gas - this.spentGas }
  }

  public walk(from: Vertice): void {
    invariant(
      this.amountInPrevious * this.amountOutPrevious >= 0,
      'Walk: Invalid amounts',
    )
    const inPrev = this.direction ? this.amountInPrevious : -this.amountInPrevious
    const outPrev = this.direction ? this.amountOutPrevious : -this.amountOutPrevious
    const to = from.getNeibour(this)

    if (to) {
      const inInc = from === this.vert0 ? from.bestIncome : -to.bestIncome
      const outInc = from === this.vert0 ? to.bestIncome : -from.bestIncome
      const inNew = inPrev + inInc
      const outNew = outPrev + outInc
      invariant(
        inNew * outNew >= 0,
        'Walk: Invalid inNew or outNew',
      )
      if (inNew >= 0) {
        this.direction = true
        this.amountInPrevious = inNew
        this.amountOutPrevious = outNew
      }
      else {
        this.direction = false
        this.amountInPrevious = -inNew
        this.amountOutPrevious = -outNew
      }
    }
    else { console.error('Error 221') }
    this.spentGas = this.spentGasNew

    ASSERT(() => {
      if (this.direction) {
        const granularity = this.pool.granularity1()
        return closeValues(
          this.amountOutPrevious / granularity,
          this.pool.getOutput(this.amountInPrevious, this.direction).output / granularity,
          1e-9,
        )
      }
      else {
        const granularity = this.pool.granularity0()
        return closeValues(
          this.amountInPrevious / granularity,
          this.pool.getOutput(this.amountOutPrevious, this.direction).output / granularity,
          1e-9,
          `"${this.pool.address}" ${inPrev} ${to?.bestIncome} ${from.bestIncome}`,
        )
      }
    }, 'Error 225')
  }
}
