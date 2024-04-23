import { JSBI, _1e18 } from '@zenlink-interface/math'

export function syToAsset(exchangeRate: JSBI, syAmount: JSBI): JSBI {
  return JSBI.divide(JSBI.multiply(syAmount, exchangeRate), _1e18)
}

export function assetToSY(exchangeRate: JSBI, assetAmount: JSBI): JSBI {
  return JSBI.divide(JSBI.multiply(assetAmount, _1e18), exchangeRate)
}
