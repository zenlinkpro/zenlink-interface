import {
  EIGHT,
  ELEVEN,
  FIFTEEN,
  FIVE,
  FOUR,
  JSBI,
  NINE,
  ONE,
  SEVEN,
  SIX,
  TEN,
  THIRTEEN,
  THREE,
  TWELVE,
  TWO,
  ZERO,
  _100,
  _1e18,
} from '@zenlink-interface/math'
import invariant from 'tiny-invariant'

export function mulDown(a: JSBI, b: JSBI): JSBI {
  return JSBI.divide(JSBI.multiply(a, b), _1e18)
}

export function divDown(a: JSBI, b: JSBI): JSBI {
  return JSBI.divide(JSBI.multiply(a, _1e18), b)
}

const ONE_20 = JSBI.BigInt(1e20)
const ONE_36 = JSBI.BigInt(1e36)
const MAX_NATURAL_EXPONENT = JSBI.BigInt(130e18)
const MIN_NATURAL_EXPONENT = JSBI.BigInt(-41e18)
const LN_36_LOWER_BOUND = JSBI.subtract(_1e18, JSBI.BigInt(1e17))
const LN_36_UPPER_BOUND = JSBI.add(_1e18, JSBI.BigInt(1e17))

// 18 decimal constants
const x0 = JSBI.BigInt('128000000000000000000') // 2ˆ7
const a0 = JSBI.BigInt('38877084059945950922200000000000000000000000000000000000') // eˆ(x0) (no decimals)
const x1 = JSBI.BigInt('64000000000000000000') // 2ˆ6
const a1 = JSBI.BigInt('6235149080811616882910000000') // eˆ(x1) (no decimals)

// 20 decimal constants
const x2 = JSBI.BigInt('3200000000000000000000') // 2ˆ5
const a2 = JSBI.BigInt('7896296018268069516100000000000000') // eˆ(x2)
const x3 = JSBI.BigInt('1600000000000000000000') // 2ˆ4
const a3 = JSBI.BigInt('888611052050787263676000000') // eˆ(x3)
const x4 = JSBI.BigInt('800000000000000000000') // 2ˆ3
const a4 = JSBI.BigInt('298095798704172827474000') // eˆ(x4)
const x5 = JSBI.BigInt('400000000000000000000') // 2ˆ2
const a5 = JSBI.BigInt('5459815003314423907810') // eˆ(x5)
const x6 = JSBI.BigInt('200000000000000000000') // 2ˆ1
const a6 = JSBI.BigInt('738905609893065022723') // eˆ(x6)
const x7 = JSBI.BigInt('100000000000000000000') // 2ˆ0
const a7 = JSBI.BigInt('271828182845904523536') // eˆ(x7)
const x8 = JSBI.BigInt('50000000000000000000') // 2ˆ-1
const a8 = JSBI.BigInt('164872127070012814685') // eˆ(x8)
const x9 = JSBI.BigInt('25000000000000000000') // 2ˆ-2
const a9 = JSBI.BigInt('128402541668774148407') // eˆ(x9)
const x10 = JSBI.BigInt('12500000000000000000') // 2ˆ-3
const a10 = JSBI.BigInt('113314845306682631683') // eˆ(x10)
const x11 = JSBI.BigInt('6250000000000000000') // 2ˆ-4
const a11 = JSBI.BigInt('106449445891785942956') // eˆ(x11)

export function exp(x: JSBI): JSBI {
  invariant(
    JSBI.GE(x, MIN_NATURAL_EXPONENT) && JSBI.LE(x, MAX_NATURAL_EXPONENT),
    'Invalid exponent',
  )
  if (JSBI.LT(x, ZERO))
    return JSBI.divide(JSBI.multiply(_1e18, _1e18), exp(JSBI.subtract(ZERO, x)))

  let firstAN
  if (JSBI.GE(x, x0)) {
    x = JSBI.subtract(x, x0)
    firstAN = a0
  }
  else if (JSBI.GE(x, x1)) {
    x = JSBI.subtract(x, x1)
    firstAN = a1
  }
  else {
    firstAN = ONE
  }

  x = JSBI.multiply(x, _100)
  let product = ONE_20

  if (JSBI.GE(x, x2)) {
    x = JSBI.subtract(x, x2)
    product = JSBI.divide(JSBI.multiply(product, a2), ONE_20)
  }
  if (JSBI.GE(x, x3)) {
    x = JSBI.subtract(x, x3)
    product = JSBI.divide(JSBI.multiply(product, a3), ONE_20)
  }
  if (JSBI.GE(x, x4)) {
    x = JSBI.subtract(x, x4)
    product = JSBI.divide(JSBI.multiply(product, a4), ONE_20)
  }
  if (JSBI.GE(x, x5)) {
    x = JSBI.subtract(x, x5)
    product = JSBI.divide(JSBI.multiply(product, a5), ONE_20)
  }
  if (JSBI.GE(x, x6)) {
    x = JSBI.subtract(x, x6)
    product = JSBI.divide(JSBI.multiply(product, a6), ONE_20)
  }
  if (JSBI.GE(x, x7)) {
    x = JSBI.subtract(x, x7)
    product = JSBI.divide(JSBI.multiply(product, a7), ONE_20)
  }
  if (JSBI.GE(x, x8)) {
    x = JSBI.subtract(x, x8)
    product = JSBI.divide(JSBI.multiply(product, a8), ONE_20)
  }
  if (JSBI.GE(x, x9)) {
    x = JSBI.subtract(x, x9)
    product = JSBI.divide(JSBI.multiply(product, a9), ONE_20)
  }

  let seriesSum = ONE_20
  let term = x
  seriesSum = JSBI.add(seriesSum, term)

  term = JSBI.divide(JSBI.divide(JSBI.multiply(term, x), ONE_20), TWO)
  seriesSum = JSBI.add(seriesSum, term)

  term = JSBI.divide(JSBI.divide(JSBI.multiply(term, x), ONE_20), THREE)
  seriesSum = JSBI.add(seriesSum, term)

  term = JSBI.divide(JSBI.divide(JSBI.multiply(term, x), ONE_20), FOUR)
  seriesSum = JSBI.add(seriesSum, term)

  term = JSBI.divide(JSBI.divide(JSBI.multiply(term, x), ONE_20), FIVE)
  seriesSum = JSBI.add(seriesSum, term)

  term = JSBI.divide(JSBI.divide(JSBI.multiply(term, x), ONE_20), SIX)
  seriesSum = JSBI.add(seriesSum, term)

  term = JSBI.divide(JSBI.divide(JSBI.multiply(term, x), ONE_20), SEVEN)
  seriesSum = JSBI.add(seriesSum, term)

  term = JSBI.divide(JSBI.divide(JSBI.multiply(term, x), ONE_20), EIGHT)
  seriesSum = JSBI.add(seriesSum, term)

  term = JSBI.divide(JSBI.divide(JSBI.multiply(term, x), ONE_20), NINE)
  seriesSum = JSBI.add(seriesSum, term)

  term = JSBI.divide(JSBI.divide(JSBI.multiply(term, x), ONE_20), TEN)
  seriesSum = JSBI.add(seriesSum, term)

  term = JSBI.divide(JSBI.divide(JSBI.multiply(term, x), ONE_20), ELEVEN)
  seriesSum = JSBI.add(seriesSum, term)

  term = JSBI.divide(JSBI.divide(JSBI.multiply(term, x), ONE_20), TWELVE)
  seriesSum = JSBI.add(seriesSum, term)

  return JSBI.divide(JSBI.multiply(JSBI.divide(JSBI.multiply(product, seriesSum), ONE_20), firstAN), _100)
}

export function ln(a: JSBI): JSBI {
  invariant(JSBI.GT(a, ZERO), 'out of bounds')
  if (JSBI.GT(a, LN_36_LOWER_BOUND) && JSBI.LT(a, LN_36_UPPER_BOUND))
    return JSBI.divide(_ln_36(a), _1e18)
  else
    return _ln(a)
}

function _ln(a: JSBI): JSBI {
  if (JSBI.LT(a, _1e18))
    return JSBI.subtract(ZERO, _ln(JSBI.divide(JSBI.multiply(_1e18, _1e18), a)))

  let sum = ZERO
  if (JSBI.GE(a, JSBI.multiply(a0, _1e18))) {
    a = JSBI.divide(a, a0)
    sum = JSBI.add(sum, x0)
  }
  if (JSBI.GE(a, JSBI.multiply(a1, _1e18))) {
    a = JSBI.divide(a, a1)
    sum = JSBI.add(sum, x1)
  }

  sum = JSBI.multiply(sum, _100)
  a = JSBI.multiply(a, _100)

  if (JSBI.GE(a, a2)) {
    a = JSBI.divide(JSBI.multiply(a, ONE_20), a2)
    sum = JSBI.add(sum, x2)
  }
  if (JSBI.GE(a, a3)) {
    a = JSBI.divide(JSBI.multiply(a, ONE_20), a3)
    sum = JSBI.add(sum, x3)
  }
  if (JSBI.GE(a, a4)) {
    a = JSBI.divide(JSBI.multiply(a, ONE_20), a4)
    sum = JSBI.add(sum, x4)
  }
  if (JSBI.GE(a, a5)) {
    a = JSBI.divide(JSBI.multiply(a, ONE_20), a5)
    sum = JSBI.add(sum, x5)
  }
  if (JSBI.GE(a, a6)) {
    a = JSBI.divide(JSBI.multiply(a, ONE_20), a6)
    sum = JSBI.add(sum, x6)
  }
  if (JSBI.GE(a, a7)) {
    a = JSBI.divide(JSBI.multiply(a, ONE_20), a7)
    sum = JSBI.add(sum, x7)
  }
  if (JSBI.GE(a, a8)) {
    a = JSBI.divide(JSBI.multiply(a, ONE_20), a8)
    sum = JSBI.add(sum, x8)
  }
  if (JSBI.GE(a, a9)) {
    a = JSBI.divide(JSBI.multiply(a, ONE_20), a9)
    sum = JSBI.add(sum, x9)
  }
  if (JSBI.GE(a, a10)) {
    a = JSBI.divide(JSBI.multiply(a, ONE_20), a10)
    sum = JSBI.add(sum, x10)
  }
  if (JSBI.GE(a, a11)) {
    a = JSBI.divide(JSBI.multiply(a, ONE_20), a11)
    sum = JSBI.add(sum, x11)
  }

  const z = JSBI.divide(JSBI.multiply(JSBI.subtract(a, ONE_20), ONE_20), JSBI.add(a, ONE_20))
  const z_squared = JSBI.divide(JSBI.multiply(z, z), ONE_20)

  let num = z
  let seriesSum = num

  num = JSBI.divide(JSBI.multiply(num, z_squared), ONE_20)
  seriesSum = JSBI.add(seriesSum, JSBI.divide(num, THREE))

  num = JSBI.divide(JSBI.multiply(num, z_squared), ONE_20)
  seriesSum = JSBI.add(seriesSum, JSBI.divide(num, FIVE))

  num = JSBI.divide(JSBI.multiply(num, z_squared), ONE_20)
  seriesSum = JSBI.add(seriesSum, JSBI.divide(num, SEVEN))

  num = JSBI.divide(JSBI.multiply(num, z_squared), ONE_20)
  seriesSum = JSBI.add(seriesSum, JSBI.divide(num, NINE))

  num = JSBI.divide(JSBI.multiply(num, z_squared), ONE_20)
  seriesSum = JSBI.add(seriesSum, JSBI.divide(num, ELEVEN))

  seriesSum = JSBI.multiply(seriesSum, TWO)

  return JSBI.divide(JSBI.add(sum, seriesSum), _100)
}

function _ln_36(x: JSBI): JSBI {
  x = JSBI.multiply(x, _1e18)
  const z = JSBI.divide(JSBI.multiply(JSBI.subtract(x, ONE_36), ONE_36), JSBI.add(x, ONE_36))
  const z_squared = JSBI.divide(JSBI.multiply(z, z), ONE_36)

  let num = z
  let seriesSum = num

  num = JSBI.divide(JSBI.multiply(num, z_squared), ONE_36)
  seriesSum = JSBI.add(seriesSum, JSBI.divide(num, THREE))

  num = JSBI.divide(JSBI.multiply(num, z_squared), ONE_36)
  seriesSum = JSBI.add(seriesSum, JSBI.divide(num, FIVE))

  num = JSBI.divide(JSBI.multiply(num, z_squared), ONE_36)
  seriesSum = JSBI.add(seriesSum, JSBI.divide(num, SEVEN))

  num = JSBI.divide(JSBI.multiply(num, z_squared), ONE_36)
  seriesSum = JSBI.add(seriesSum, JSBI.divide(num, NINE))

  num = JSBI.divide(JSBI.multiply(num, z_squared), ONE_36)
  seriesSum = JSBI.add(seriesSum, JSBI.divide(num, ELEVEN))

  num = JSBI.divide(JSBI.multiply(num, z_squared), ONE_36)
  seriesSum = JSBI.add(seriesSum, JSBI.divide(num, THIRTEEN))

  num = JSBI.divide(JSBI.multiply(num, z_squared), ONE_36)
  seriesSum = JSBI.add(seriesSum, JSBI.divide(num, FIFTEEN))

  return JSBI.multiply(seriesSum, TWO)
}
