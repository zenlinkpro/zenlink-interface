import { StandardPool } from "../entities"
import { closeValues, getBigNumber } from "../util"
import { expect, describe, it } from 'vitest'
import { findMultiRouteExactIn } from "../routers"
import { BigNumber } from "@ethersproject/bignumber"
import { performance } from "perf_hooks"
import { BaseToken, RouteStatus, SplitMultiRoute } from "@zenlink-interface/amm"

const gasPrice = 1 * 200 * 1e-9

const USDC: BaseToken = {
  name: 'USDC',
  address: 'USDC',
  symbol: 'USDC',
  chainId: 1
}
const WNATIVE: BaseToken = {
  name: 'WNATIVE',
  address: 'WNATIVE',
  symbol: 'WNATIVE',
  chainId: 1
}

function getPool(
  tokens: BaseToken[],
  t0: number,
  t1: number,
  price: number[],
  reserve: number,
  fee = 0.003,
  imbalance = 0
): StandardPool {
  return new StandardPool(
    `pool-${t0}-${t1}-${reserve}-${fee}`,
    { ...tokens[t0] },
    { ...tokens[t1] },
    fee,
    getBigNumber(reserve),
    getBigNumber(Math.round(reserve / (price[t1] / price[t0]) - imbalance))
  )
}

function checkExactOut(routeIn: SplitMultiRoute, routeOut: SplitMultiRoute) {
  expect(routeOut).toBeDefined()
  expect(closeValues(routeIn.amountIn, routeOut.amountIn, 5e-2)).toBeTruthy()
  expect(closeValues(routeIn.amountOut, routeOut.amountOut, 1e-12)).toBeTruthy()
  expect(closeValues(routeIn.priceImpact as number, routeOut.priceImpact as number, 5e-2)).toBeTruthy()
  expect(closeValues(routeIn.primaryPrice as number, routeOut.primaryPrice as number, 5e-2)).toBeTruthy()
  expect(closeValues(routeIn.swapPrice as number, routeOut.swapPrice as number, 5e-2)).toBeTruthy()
}

function numberPrecision(n: number, precision = 2): number {
  if (n == 0) return 0
  const digits = Math.ceil(Math.log10(n))
  if (digits >= precision) return Math.round(n)
  const shift = Math.pow(10, precision - digits)
  return Math.round(n * shift) / shift
}

// ====================== Env 1 ==================
const price = [1, 1, 1, 1, 1]
const tokens: BaseToken[] = price.map((_, i) => ({
  name: '' + (i + 1),
  address: 'token_addres ' + (i + 1),
  symbol: '' + (i + 1),
  chainId: 1
}))

const testPool0_1 = getPool(tokens, 0, 1, price, 1_500_0)
const testPool0_2 = getPool(tokens, 0, 2, price, 1_000_0)
const testPool1_2 = getPool(tokens, 1, 2, price, 1_000_000_000)
const testPool1_3 = getPool(tokens, 1, 3, price, 1_000_0)
const testPool2_3 = getPool(tokens, 2, 3, price, 1_500_0)

const testPools = [testPool0_1, testPool0_2, testPool1_3, testPool2_3, testPool1_2]

// ======================= Env2 ===================
const price2 = [1, 2, 2.2, 15, 0.01]
const tokens2 = price2.map((_, i) => ({
  name: '' + (i + 1),
  address: 'token_addres ' + (i + 1),
  symbol: '' + (i + 1),
}))

const testPool0_1_2 = getPool(tokens2, 0, 1, price2, 15_000)
const testPool0_2_2 = getPool(tokens2, 0, 2, price2, 100_000)
const testPool1_2_2 = getPool(tokens2, 1, 2, price2, 1_000_000_000)
const testPool1_3_2 = getPool(tokens2, 1, 3, price2, 80_000)
const testPool2_3_2 = getPool(tokens2, 2, 3, price2, 15_000)

const testPools2 = [testPool0_1_2, testPool0_2_2, testPool1_3_2, testPool2_3_2, testPool1_2_2]

describe('Multirouting for bridge topology', () => {
  it('works correct for equal prices', () => {
    const res = findMultiRouteExactIn(
      { ...tokens[0] },
      { ...tokens[3] },
      10000,
      testPools,
      { ...tokens[2] },
      gasPrice,
      100
    )

    expect(res).toBeDefined()
    expect(res?.status).toEqual(RouteStatus.Success)
    expect(res?.legs.length).toEqual(testPools.length)
    expect(res?.legs[res.legs.length - 1].swapPortion).toEqual(1)
    expect(res.priceImpact).toBeGreaterThan(0)
  })

  it('should work with 20*1e9 as gas price (case form integration)', () => {
    const res = findMultiRouteExactIn(
      USDC,
      WNATIVE,
      4 * 1e6,
      [
        new StandardPool(
          '0x83a19C45358De3611cf297969AEDf8E5Ba7E10FB',
          USDC,
          WNATIVE,
          0.003,
          BigNumber.from('879752148'),
          BigNumber.from('227627092068744941')
        ),
      ],
      WNATIVE,
      20 * 1e9
    )

    expect(res).toBeDefined()
    expect(res?.status).toEqual(RouteStatus.Success)
  })

  it('not connected tokens', () => {
    const res = findMultiRouteExactIn(tokens[0], tokens[4], 20000, testPools, tokens[2], gasPrice, 100)
    expect(res).toBeDefined()
    expect(res?.status).toEqual(RouteStatus.NoWay)
  })

  it('partial routing', () => {
    // Try to route too big value => all pools achive min liquidity => no routing any more
    const res = findMultiRouteExactIn(tokens[0], tokens[3], 1000000, testPools, tokens[2], gasPrice, 100)

    expect(res).toBeDefined()
    expect(res?.status).toEqual(RouteStatus.Partial)
    expect(res?.legs.length).toEqual(testPools.length)
    expect(res?.legs[res.legs.length - 1].swapPortion).toEqual(1)
    expect(res.priceImpact).toBeGreaterThan(0)
  })

  it('Special case for _one_line_ coverage', () => {
    const res = findMultiRouteExactIn(
      tokens[0],
      tokens[3],
      10000,
      testPools,
      tokens[2],
      gasPrice,
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]
    )

    expect(res).toBeDefined()
    expect(res?.status).toEqual(RouteStatus.Success)
    expect(res?.legs[res.legs.length - 1].swapPortion).toEqual(1)
    expect(res.priceImpact).toBeGreaterThan(0)
  })

  it('Varios step number check', () => {
    const steps = [1, 2, 3, 5, 10, 30, 100, 300, 1000]
    steps.forEach((s) => {
      const res = findMultiRouteExactIn(tokens[0], tokens[3], 10000, testPools, tokens[2], gasPrice, s)
      expect(res).toBeDefined()
      expect(res?.status).toEqual(RouteStatus.Success)
      expect(res?.legs[res.legs.length - 1].swapPortion).toEqual(1)
      expect(res.priceImpact).toBeGreaterThan(0)
    })
  })

  it('works correct for not equal prices', () => {
    const res = findMultiRouteExactIn(tokens2[0], tokens2[3], 10000, testPools2, tokens2[2], gasPrice, 100)
    expect(res).toBeDefined()
    expect(res?.status).toEqual(RouteStatus.Success)
    expect(res?.legs.length).toEqual(testPools.length)
    expect(res?.legs[res.legs.length - 1].swapPortion).toEqual(1)
    expect(res.priceImpact).toBeGreaterThan(0)
  })

  it('Varios step number check for not equal prices', () => {
    const steps = [1, 2, 3, 5, 10, 30, 100, 300, 1000]
    steps.forEach((s) => {
      const res = findMultiRouteExactIn(tokens2[0], tokens2[3], 10000, testPools2, tokens2[2], gasPrice, s)
      expect(res).toBeDefined()
      expect(res?.status).toEqual(RouteStatus.Success)
      expect(res?.legs[res.legs.length - 1].swapPortion).toEqual(1)
      expect(res.priceImpact).toBeGreaterThan(0)
    })
  })

  it('very small swap', () => {
    const token0 = {
      name: 'Token0',
      address: 'Token0Address',
      symbol: 'Token0Symbol',
      chainId: 1
    }
    const token1 = {
      name: 'Token1',
      address: 'Token1Address',
      symbol: 'Token1Symbol',
      chainId: 1
    }
    const pool = getPool([token0, token1], 0, 1, [1, 2], 1e18, 0.03, 0)
    const res = findMultiRouteExactIn(token0, token1, 100, [pool], token1, 200)
    expect(res.amountOut).toBeGreaterThan(0)
    expect(res.priceImpact).toBeGreaterThan(0)
  })

  it.skip('timing mesure', () => {
    const pool = testPool1_2_2
    const amountIn = 1_000_000
    const start0 = performance.now()
    for (let i = 0; i < 10_000_000; ++i) pool.getOutput(amountIn * i, i % 2 == 0)
    const start1 = performance.now()
    for (let i = 0; i < 10_000_000; ++i) pool.getInput(amountIn * i, i % 2 == 0)
    const start2 = performance.now()
    for (let i = 0; i < 10_000_000; ++i) pool.calcCurrentPriceWithoutFee(i % 2 == 0)
    const finish = performance.now()
    const t1 = numberPrecision((start1 - start0) / 10_000_000)
    const t2 = numberPrecision((start2 - start1) / 10_000_000)
    const t3 = numberPrecision((finish - start2) / 10_000_000)
    console.log(`ConstantProduct pool calcOutByIn: ${t1}ms, calcInByOut: ${t2}ms, price: ${t3}ms`)
  })
})
