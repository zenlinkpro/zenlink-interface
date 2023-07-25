import type { BigNumber } from 'ethers'

export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(140).div(100)
}
