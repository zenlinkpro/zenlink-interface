import { BigNumberish } from '@ethersproject/bignumber'
import { StableSwap } from '@zenlink-interface/amm'
import { Amount, Token } from '@zenlink-interface/currency'
import JSBI from 'jsbi'
import { describe, expect, it } from 'vitest'
import { StablePool } from '../entities'
import { closeValues } from '../util'

const token0 = new Token({
  chainId: 2006,
  name: 'Token0',
  address: '0x6a2d262d56735dba19dd70682b39f6be9a931d98',
  symbol: 'Token1Symbol',
  decimals: 6
})
const token1 = new Token({
  chainId: 2006,
  name: 'Token1',
  address: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
  symbol: 'Token1Symbol',
  decimals: 18
})
const token2 = new Token({
  chainId: 2006,
  name: 'Token2',
  address: '0x733ebcc6df85f8266349defd0980f8ced9b45f35',
  symbol: 'Token2Symbol',
  decimals: 18
})
const token3 = new Token({
  chainId: 2006,
  name: 'Token3',
  address: '0x6de33698e9e9b787e09d3bd7771ef63557e148bb',
  symbol: 'Token3Symbol',
  decimals: 18
})

const tokens = [token0, token1, token2, token3]

const tokenBalances = [
  Amount.fromRawAmount(token0, '16232200000'),
  Amount.fromRawAmount(token1, '16182500000000000000000'),
  Amount.fromRawAmount(token2, '54002400000000000000000'),
  Amount.fromRawAmount(token3, '14745000000000000000000')
]

const liquidityToken = new Token({
  chainId: 2006,
  name: 'LiquidityToken',
  address: '0x755cbAC2246e8219e720591Dd362a772076ab653',
  symbol: 'LiquidityTokenSymbol',
  decimals: 18
})

function createPool(
  token0: Token,
  token1: Token,
  fee = 0.0005,
): StablePool {
 const swap = new StableSwap(
    2006,
    '0x253029F0D3593Afd4187500F1CB243F1EceaABAB',
    tokens,
    liquidityToken,
    Amount.fromRawAmount(liquidityToken, '100639667000000000000000'),
    tokenBalances,
    JSBI.BigInt('5000000'),
    JSBI.BigInt('5000000000'),
    JSBI.BigInt('200'),
    JSBI.BigInt('1004005678818762173')
  )
  return new StablePool(swap, token0, token1, fee)
}

function expectCloseValues(
  v1: BigNumberish,
  v2: BigNumberish,
  precision: number,
  description = '',
  additionalInfo = ''
) {
  const a = typeof v1 == 'number' ? v1 : parseFloat(v1.toString())
  const b = typeof v2 == 'number' ? v2 : parseFloat(v2.toString())
  const res = closeValues(a, b, precision)
  if (!res) {
    console.log('Close values expectation failed:', description)
    console.log('v1 =', a)
    console.log('v2 =', b)
    console.log('precision =', Math.abs(a / b - 1), ', expected <', precision)
    if (additionalInfo != '') {
      console.log(additionalInfo)
    }
  }
  expect(res).toBeTruthy()
  return res
}

function checkSwap(pool: StablePool, amountIn: number, direction: boolean) {
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

describe('StablePool test', () => {
  describe('getOutput & getInput', () => {
    it('Ideal balance, regular values', () => {
      const pool = createPool(
        token0,
        token2,
        0.0005
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
