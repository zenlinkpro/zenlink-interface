import { JSBI, _1e18 } from '@zenlink-interface/math'

export function mulDown(a: JSBI, b: JSBI): JSBI {
  return JSBI.divide(JSBI.multiply(a, b), _1e18)
}

export function divDown(a: JSBI, b: JSBI): JSBI {
  return JSBI.divide(JSBI.multiply(a, _1e18), b)
}
