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

  describe('vDOT JUL-2025', () => {
    it('Parameters', () => {
      const rateMin = 0.12
      const rateMax = 0.24
      const startTimestamp = 1719407555
      const endTimestamp = 1751500800
      expect(calculateParameters(rateMin, rateMax, startTimestamp, endTimestamp)).toMatchInlineSnapshot(`
        {
          "initialRateAnchor": 1183483673000000000,
          "scalarRoot": 36513737144000000000,
        }
      `)
    })
    it('LnFeeRateRoot', () => {
      expect(calcFee(0.3)).toMatchInlineSnapshot('2995508979000000')
    })
  })

  describe('vGLMR JUL-2025', () => {
    it('Parameters', () => {
      const rateMin = 0.04
      const rateMax = 0.12
      const startTimestamp = 1719407555
      const endTimestamp = 1751500800
      expect(calculateParameters(rateMin, rateMax, startTimestamp, endTimestamp)).toMatchInlineSnapshot(`
        {
          "initialRateAnchor": 1081483044000000000,
          "scalarRoot": 54856182234000000000,
        }
      `)
    })
    it('LnFeeRateRoot', () => {
      expect(calcFee(0.3)).toMatchInlineSnapshot('2995508979000000')
    })
  })
})
