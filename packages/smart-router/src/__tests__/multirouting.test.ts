import { BaseToken, MultiRoute, RouteStatus, StandardPool } from "../entities"
import { closeValues, getBigNumber } from "../util"
import { expect, describe, it } from 'vitest'
import { findMultiRouteExactIn } from "../routers"

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

function checkExactOut(routeIn: MultiRoute, routeOut: MultiRoute) {
  expect(routeOut).toBeDefined()
  expect(closeValues(routeIn.amountIn, routeOut.amountIn, 5e-2)).toBeTruthy()
  expect(closeValues(routeIn.amountOut, routeOut.amountOut, 1e-12)).toBeTruthy()
  expect(closeValues(routeIn.priceImpact as number, routeOut.priceImpact as number, 5e-2)).toBeTruthy()
  expect(closeValues(routeIn.primaryPrice as number, routeOut.primaryPrice as number, 5e-2)).toBeTruthy()
  expect(closeValues(routeIn.swapPrice as number, routeOut.swapPrice as number, 5e-2)).toBeTruthy()
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
})
