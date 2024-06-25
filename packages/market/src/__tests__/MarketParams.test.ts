import { describe, expect, it } from 'vitest'
import { calcFee, calculateParameters } from '../utils'

describe('MarketParams', () => {
  describe('For Test', () => {
    it('Parameters', () => {
      const rateMin = 0.12
      const rateMax = 0.24
      const startTimestamp = 1719310428
      const endTimestamp = 1750896000
      expect(calculateParameters(rateMin, rateMax, startTimestamp, endTimestamp)).toMatchInlineSnapshot(`
        {
          "initialRateAnchor": 1180309449000000000,
          "scalarRoot": 36610907921000000000,
        }
      `)
    })
    it('LnFeeRateRoot', () => {
      expect(calcFee(0.5)).toMatchInlineSnapshot(`4987541511000000`)
    })
  })
})
