/* eslint-disable no-console */
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
  if (!res)
    console.log('Expected close: ', a, b, accuracy, logInfoIfFalse)

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
