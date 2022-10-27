import type { Token } from '@zenlink-interface/currency'
import { Amount, Price } from '@zenlink-interface/currency'
import invariant from 'tiny-invariant'
import { JSBI, ONE } from '@zenlink-interface/math'
import { getStableSwapOutputAmount } from '../StablePool'
import type { MultiPath } from './MultiPath'

export class MultiRoute {
  public readonly chainId: number
  public readonly input: Token
  public readonly inputAmount: Amount<Token>
  public readonly output: Token
  public readonly routePath: MultiPath[]
  public readonly tokenPath: Token[]

  public get midPrice(): Price<Token, Token> {
    const prices: Price<Token, Token>[] = []
    let currentAmount = this.inputAmount

    for (const [i, path] of this.routePath.entries()) {
      let price: Price<Token, Token>

      if (path.stable) {
        const outputAmount = getStableSwapOutputAmount(path, currentAmount)

        price = new Price(
          path.input,
          path.output,
          JSBI.multiply(ONE, currentAmount.scale),
          JSBI.multiply(ONE, outputAmount.scale),
        )
        currentAmount = outputAmount
      }
      else {
        invariant(typeof path.pair !== 'undefined', 'PAIR')
        const pair = path.pair

        price = this.tokenPath[i].equals(pair.token0)
          ? new Price(pair.reserve0.currency, pair.reserve1.currency, pair.reserve0.quotient, pair.reserve1.quotient)
          : new Price(pair.reserve1.currency, pair.reserve0.currency, pair.reserve1.quotient, pair.reserve0.quotient)
        currentAmount = this.tokenPath[i].equals(pair.token0)
          ? Amount.fromRawAmount(pair.token1, currentAmount.multiply(price).quotient)
          : Amount.fromRawAmount(pair.token0, currentAmount.multiply(price).quotient)
      }

      prices.push(price)
    }

    return prices.slice(1).reduce((accumulator, currentValue) => accumulator.multiply(currentValue), prices[0])
  }

  public constructor(chainId: number, paths: MultiPath[], inputAmount: Amount<Token>, output?: Token) {
    invariant(paths.length > 0, 'POOLS')
    invariant(paths[0].input.equals(inputAmount.currency), 'INPUT')
    invariant(typeof output === 'undefined' || paths[paths.length - 1].output.equals(output), 'OUTPUT')

    const tokenPath: Token[] = [inputAmount.currency]

    for (const [i, path] of paths.entries()) {
      const currentInput = tokenPath[i]

      invariant(path.input.equals(currentInput), 'TOKENPATH')
      tokenPath.push(path.output)
    }

    this.chainId = chainId
    this.routePath = paths
    this.tokenPath = tokenPath
    this.input = inputAmount.currency
    this.inputAmount = inputAmount
    this.output = output ?? paths[paths.length - 1].output
  }
}
