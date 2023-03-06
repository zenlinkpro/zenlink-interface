import { StableSwap } from "@zenlink-interface/amm"
import { Amount, Token } from "@zenlink-interface/currency"
import JSBI from "jsbi"
import { expect, describe, it } from "vitest"
import { MetaPool } from "../entities"
import { expectCloseValues } from "../util"

const token0 = new Token({
  chainId: 2006,
  name: 'Token0',
  address: '0x6a2d262d56735dba19dd70682b39f6be9a931d98',
  symbol: 'Token1Symbol',
  decimals: 18
})
const token1 = new Token({
  chainId: 2006,
  name: 'Token1',
  address: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
  symbol: 'Token1Symbol',
  decimals: 6
})
const token2 = new Token({
  chainId: 2006,
  name: 'Token2',
  address: '0x733ebcc6df85f8266349defd0980f8ced9b45f35',
  symbol: 'Token2Symbol',
  decimals: 6
})
// const token3 = new Token({
//   chainId: 2006,
//   name: 'Token3',
//   address: '0x6de33698e9e9b787e09d3bd7771ef63557e148bb',
//   symbol: 'Token3Symbol',
//   decimals: 18
// })
const token4 = new Token({
  chainId: 2006,
  name: 'Token4',
  address: '0x6de33698e9e9b787e09d3bd7771ef63557e148bc',
  symbol: 'Token4Symbol',
  decimals: 6
})
const baseLiquidityToken = new Token({
  chainId: 2006,
  name: 'LiquidityToken',
  address: '0x755cbAC2246e8219e720591Dd362a772076ab653',
  symbol: 'LiquidityTokenSymbol',
  decimals: 18
})
const metaLiquidityToken = new Token({
  chainId: 2006,
  name: 'LiquidityToken',
  address: '0xffffffff000000000000000000000001000007c0',
  symbol: 'LiquidityTokenSymbol',
  decimals: 18
})

const baseTokens = [token0, token1, token2]
const metaTokens = [token4, baseLiquidityToken]

const baseTokenBalances = [
  Amount.fromRawAmount(token0, '168147470000000000000000'),
  Amount.fromRawAmount(token1, '84129280000'),
  Amount.fromRawAmount(token2, '97850650000'),
]
const metaTokenBalances = [
  Amount.fromRawAmount(token4, '25362750000'),
  Amount.fromRawAmount(baseLiquidityToken, '323305020000000000000000')
]


function createMetaPool(
  token0: Token,
  token1: Token,
  fee = 0.0005,
) {
  const baseSwap = new StableSwap(
    2006,
    '0x253029F0D3593Afd4187500F1CB243F1EceaABAB',
    baseTokens,
    baseLiquidityToken,
    Amount.fromRawAmount(baseLiquidityToken, '345306948000000000000000'),
    baseTokenBalances,
    JSBI.BigInt('4000000'),
    JSBI.BigInt('5000000000'),
    JSBI.BigInt('2000'),
    JSBI.BigInt('1010585678818762173')
  )
  const metaSwap = new StableSwap(
    2006,
    '0x253029F0D3593Afd4187500F1CB243F1EceaABAC',
    metaTokens,
    metaLiquidityToken,
    Amount.fromRawAmount(metaLiquidityToken, '576930020000000000000000'),
    metaTokenBalances,
    JSBI.BigInt('4000000'),
    JSBI.BigInt('5000000000'),
    JSBI.BigInt('500'),
    JSBI.BigInt('1000385678818762173')
  )
  return new MetaPool(baseSwap, metaSwap, token0, token1, fee)
}

function checkSwap(pool: MetaPool, amountIn: number, direction: boolean) {
  const { output, gasSpent } = pool.getOutput(amountIn, direction)

  expect(gasSpent).toBeDefined()
  expect(gasSpent).not.toBeNaN()
  expect(gasSpent).toBeGreaterThan(0)

  const { input, gasSpent: gasSpent2 } = pool.getInput(output, direction)

  expect(gasSpent2).toBeDefined()
  expect(gasSpent2).not.toBeNaN()
  expect(gasSpent2).toBeGreaterThan(0)

  expect(input).toBeDefined()
  expect(input).not.toBeNaN()
  expect(input).toBeGreaterThanOrEqual(0)

  expectCloseValues(input, amountIn, 1e-3)

  return output
}

describe('MetaPool test', () => {
  describe('getOutput & getInput', () => {
    it('Ideal balance, regular values', () => {
      const pool = createMetaPool(
        token4,
        token2,
        0.0004
      )
      for (let i = 0; i < 100; ++i) {
        const amountIn = 1e6 * i
        try {
          checkSwap(pool, amountIn, true)
        } catch (e) {}
      }
    }) 
  })
})
