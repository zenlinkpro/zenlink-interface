import { JSBI, ONE, _1e18 } from '@zenlink-interface/math'

export function syToAsset(exchangeRate: JSBI, syAmount: JSBI): JSBI {
  return JSBI.divide(JSBI.multiply(syAmount, exchangeRate), _1e18)
}

export function syToAssetUp(exchangeRate: JSBI, syAmount: JSBI) {
  return JSBI.divide(
    JSBI.subtract(JSBI.add(JSBI.multiply(syAmount, exchangeRate), _1e18), ONE),
    _1e18,
  )
}

export function assetToSy(exchangeRate: JSBI, assetAmount: JSBI): JSBI {
  return JSBI.divide(JSBI.multiply(assetAmount, _1e18), exchangeRate)
}

export function assetToSyUp(exchangeRate: JSBI, assetAmount: JSBI): JSBI {
  return JSBI.divide(
    JSBI.subtract(JSBI.add(JSBI.multiply(assetAmount, _1e18), exchangeRate), ONE),
    exchangeRate,
  )
}
