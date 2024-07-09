/* eslint-disable no-console */
import type { BigNumberish } from '@ethersproject/bignumber'
import { BigNumber } from '@ethersproject/bignumber'
import invariant from 'tiny-invariant'

export function closeValues(a: number, b: number, accuracy: number, logInfoIfFalse = ''): boolean {
  if (accuracy === 0)
    return a === b
  if (Math.abs(a) < 1 / accuracy)
    return Math.abs(a - b) <= 10
  if (Math.abs(b) < 1 / accuracy)
    return Math.abs(a - b) <= 10
  const res = Math.abs(a / b - 1) < accuracy
  if (!res && logInfoIfFalse)
    console.log('Expected close: ', a, b, accuracy, logInfoIfFalse)

  return res
}

export function expectCloseValues(
  v1: BigNumberish,
  v2: BigNumberish,
  precision: number,
  description = '',
  additionalInfo = '',
) {
  const a = typeof v1 == 'number' ? v1 : Number.parseFloat(v1.toString())
  const b = typeof v2 == 'number' ? v2 : Number.parseFloat(v2.toString())
  const res = closeValues(a, b, precision)
  if (!res) {
    console.log('Close values expectation failed:', description)
    console.log('v1 =', a)
    console.log('v2 =', b)
    console.log('precision =', Math.abs(a / b - 1), ', expected <', precision)
    if (additionalInfo !== '')
      console.log(additionalInfo)
  }
  invariant(res, 'close values')
  return res
}

export function getBigNumber(value: number): BigNumber {
  const v = Math.abs(value)
  if (v < Number.MAX_SAFE_INTEGER)
    return BigNumber.from(Math.round(value))

  const exp = Math.floor(Math.log(v) / Math.LN2)
  invariant(exp >= 51, 'Internal Error 314')
  const shift = exp - 51
  const mant = Math.round(v / 2 ** shift)
  const res = BigNumber.from(mant).mul(BigNumber.from(2).pow(shift))
  return value > 0 ? res : res.mul(-1)
}

export function getNumber(value: BigNumber | bigint): number {
  return Number.parseFloat(value.toString())
}

export function revertPositive(f: (x: number) => number, out: number, hint = 1): number {
  try {
    if (out <= f(0))
      return 0
    let min, max
    if (f(hint) > out) {
      min = hint / 2
      while (f(min) > out) min /= 2
      max = min * 2
    }
    else {
      max = hint * 2
      while (f(max) < out) max *= 2
      min = max / 2
    }

    while (max / min - 1 > 1e-4) {
      const x0: number = (min + max) / 2
      const y0 = f(x0)
      if (out === y0)
        return x0
      if (out < y0)
        max = x0
      else min = x0
    }
    return (min + max) / 2
  }
  catch (e) {
    return 0
  }
}
