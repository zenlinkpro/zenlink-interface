import { Fraction } from '@zenlink-interface/math'

// Fee - Tiers TBD
export enum Fee {
  LOW = 1,
  MEDIUM = 5,
  AVERAGE = 10,
  DEFAULT = 30,
  HIGH = 100,
}

export const STANDARD_SWAP_FEE_FRACTION = new Fraction(30, 10000)
export const STABLE_SWAP_FEE_FRACTION = new Fraction(5, 10000)
export const STANDARD_SWAP_FEE_NUMBER = Number(STANDARD_SWAP_FEE_FRACTION.toSignificant(3))
export const STABLE_SWAP_FEE_NUMBER = Number(STABLE_SWAP_FEE_FRACTION.toSignificant(3))
