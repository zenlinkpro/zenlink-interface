import { Amount } from '@zenlink-interface/currency'
import type { Token } from '@zenlink-interface/currency'
import { FOUR, Fraction, JSBI, ONE, TEN, TWO, ZERO } from '@zenlink-interface/math'
import invariant from 'tiny-invariant'
import { CalculationError } from '../errors'

const FEE_DENOMINATOR = JSBI.BigInt(1e10)
const A_PRECISION = JSBI.BigInt(100)
const POOL_TOKEN_COMMON_DECIMALS = JSBI.BigInt(18)

export class StableSwap {
  public readonly chainId: number
  public readonly contractAddress: string
  public readonly pooledTokens: Token[]
  public readonly liquidityToken: Token
  public readonly totalSupply: Amount<Token>
  private readonly tokenMultipliers: JSBI[]
  public readonly balances: Amount<Token>[]
  public readonly swapFee: JSBI
  public readonly adminFee: JSBI
  public readonly A: JSBI
  public readonly APrecise: JSBI
  public readonly virtualPrice: Fraction

  public constructor(
    chainId: number,
    contractAddress: string,
    pooledTokens: Token[],
    liquidityToken: Token,
    totalSupply: Amount<Token>,
    balances: Amount<Token>[],
    swapFee: JSBI,
    adminFee: JSBI,
    A: JSBI,
    virtualPrice: JSBI,
  ) {
    this.chainId = chainId
    this.contractAddress = contractAddress
    this.pooledTokens = pooledTokens
    this.liquidityToken = liquidityToken
    this.totalSupply = totalSupply
    this.tokenMultipliers = this.pooledTokens.map(
      token => JSBI.exponentiate(
        TEN,
        JSBI.subtract(POOL_TOKEN_COMMON_DECIMALS, JSBI.BigInt(token.decimals)),
      ),
    )
    this.balances = balances
    this.swapFee = swapFee
    this.adminFee = adminFee
    this.A = A
    this.APrecise = JSBI.multiply(A, A_PRECISION)
    this.virtualPrice = new Fraction(virtualPrice, JSBI.exponentiate(TEN, POOL_TOKEN_COMMON_DECIMALS))
  }

  private _xp(balances: Amount<Token>[], tokenMultipliers: JSBI[]): JSBI[] {
    return balances.map((balance, i) => JSBI.multiply(balance.quotient, tokenMultipliers[i]))
  }

  private _sumOf(x: JSBI[]): JSBI {
    return x.reduce((memo, current) => JSBI.add(memo, current), ZERO)
  }

  private _distance(x: JSBI, y: JSBI): JSBI {
    return JSBI.greaterThan(x, y) ? JSBI.subtract(x, y) : JSBI.subtract(y, x)
  }

  private _getD(xp: JSBI[], amp: JSBI): JSBI {
    const nCoins = JSBI.BigInt(xp.length)
    const sum = this._sumOf(xp)

    if (JSBI.equal(sum, ZERO))
      return ZERO

    let Dprev = ZERO
    let D = sum
    const Ann = JSBI.multiply(amp, nCoins)

    for (let i = 0; i < 255; i++) {
      let D_P = D

      for (let j = 0; j < xp.length; j++)
        D_P = JSBI.divide(JSBI.multiply(D_P, D), JSBI.multiply(xp[j], nCoins))

      Dprev = D
      D = JSBI.divide(
        JSBI.multiply(
          JSBI.add(JSBI.divide(JSBI.multiply(Ann, sum), A_PRECISION), JSBI.multiply(D_P, nCoins)),
          D,
        ),
        JSBI.add(
          JSBI.divide(JSBI.multiply(JSBI.subtract(Ann, A_PRECISION), D), A_PRECISION),
          JSBI.multiply(JSBI.add(nCoins, ONE), D_P),
        ),
      )

      if (JSBI.lessThanOrEqual(this._distance(D, Dprev), ONE))
        return D
    }

    throw new CalculationError()
  }

  private _getY(inIndex: number, outIndex: number, inBalance: JSBI, normalizedBalances: JSBI[]): JSBI {
    invariant(inIndex !== outIndex, 'sameToken')
    const nCoins = this.pooledTokens.length

    invariant(inIndex < nCoins && outIndex < nCoins, 'indexOutOfRange')
    const amp = this.APrecise
    const Ann = JSBI.multiply(amp, JSBI.BigInt(nCoins))
    const D = this._getD(normalizedBalances, amp)

    let sum = ZERO
    let c = D

    for (let i = 0; i < nCoins; i++) {
      if (i === outIndex)
        continue
      const x = i === inIndex ? inBalance : normalizedBalances[i]

      sum = JSBI.add(sum, x)
      c = JSBI.divide(JSBI.multiply(c, D), JSBI.multiply(x, JSBI.BigInt(nCoins)))
    }

    c = JSBI.divide(
      JSBI.multiply(JSBI.multiply(c, D), A_PRECISION),
      JSBI.multiply(Ann, JSBI.BigInt(nCoins)),
    )
    const b = JSBI.add(sum, JSBI.divide(JSBI.multiply(D, A_PRECISION), Ann))

    let lastY = ZERO
    let y = D

    for (let i = 0; i < 255; i++) {
      lastY = y
      y = JSBI.divide(
        JSBI.add(JSBI.multiply(y, y), c),
        JSBI.subtract(JSBI.add(JSBI.multiply(TWO, y), b), D),
      )
      if (JSBI.lessThanOrEqual(this._distance(lastY, y), ONE))
        return y
    }

    throw new CalculationError()
  }

  private _getYD(A: JSBI, index: number, xp: JSBI[], D: JSBI): JSBI {
    const nCoins = this.pooledTokens.length

    invariant(index < nCoins, 'indexOutOfRange')
    const Ann = JSBI.multiply(A, JSBI.BigInt(nCoins))
    let c = D
    let s = ZERO
    let _x = ZERO
    let yPrev = ZERO

    for (let i = 0; i < nCoins; i++) {
      if (i === index)
        continue
      _x = xp[i]
      s = JSBI.add(s, _x)
      c = JSBI.divide(JSBI.multiply(c, D), JSBI.multiply(_x, JSBI.BigInt(nCoins)))
    }

    c = JSBI.divide(
      JSBI.multiply(JSBI.multiply(c, D), A_PRECISION),
      JSBI.multiply(Ann, JSBI.BigInt(nCoins)),
    )
    const b = JSBI.add(s, JSBI.divide(JSBI.multiply(D, A_PRECISION), Ann))
    let y = D

    for (let i = 0; i < 255; i++) {
      yPrev = y
      y = JSBI.divide(
        JSBI.add(JSBI.multiply(y, y), c),
        JSBI.subtract(JSBI.add(JSBI.multiply(TWO, y), b), D),
      )
      if (JSBI.lessThanOrEqual(this._distance(yPrev, y), ONE))
        return y
    }

    throw new CalculationError()
  }

  private get _feePerToken(): JSBI {
    const nCoins = this.pooledTokens.length

    return JSBI.divide(
      JSBI.multiply(this.adminFee, JSBI.BigInt(nCoins)),
      JSBI.multiply(FOUR, JSBI.subtract(JSBI.BigInt(nCoins), ONE)),
    )
  }

  public get xp(): JSBI[] {
    return this._xp(this.balances, this.tokenMultipliers)
  }

  public getTokenIndex(token: Token): number {
    return this.pooledTokens.findIndex(pooledToken => pooledToken.equals(token))
  }

  public getToken(index: number): Token {
    return this.pooledTokens[index]
  }

  public involvesToken(token: Token): boolean {
    return this.pooledTokens.some(pooledToken => pooledToken.equals(token))
  }

  public calculateTokenAmount(amounts: Amount<Token>[], deposit: boolean): Amount<Token> {
    const nCoins = this.pooledTokens.length

    invariant(amounts.length === nCoins, 'invalidAmountsLength')
    const amp = this.APrecise
    const D0 = this._getD(this.xp, amp)
    const newBalances = this.balances.map(
      (balance, i) => deposit ? balance.add(amounts[i]) : balance.subtract(amounts[i]),
    )
    const D1 = this._getD(this._xp(newBalances, this.tokenMultipliers), amp)
    const totalSupply = this.totalSupply.quotient

    if (JSBI.equal(totalSupply, ZERO))
      return Amount.fromRawAmount(this.liquidityToken, D1)
    const diff = deposit ? JSBI.subtract(D1, D0) : JSBI.subtract(D0, D1)

    return Amount.fromRawAmount(
      this.liquidityToken,
      JSBI.divide(JSBI.multiply(diff, this.totalSupply.quotient), D0),
    )
  }

  public calculateSwap(inIndex: number, outIndex: number, inAmount: Amount<Token>): Amount<Token> {
    const normalizedBalances = this.xp
    const newInBalance = JSBI.add(
      normalizedBalances[inIndex],
      JSBI.multiply(inAmount.quotient, this.tokenMultipliers[inIndex]),
    )
    const outBalance = this._getY(inIndex, outIndex, newInBalance, normalizedBalances)
    const outAmount = JSBI.divide(
      JSBI.subtract(JSBI.subtract(normalizedBalances[outIndex], outBalance), ONE),
      this.tokenMultipliers[outIndex],
    )
    const fee = JSBI.divide(JSBI.multiply(this.adminFee, outAmount), FEE_DENOMINATOR)

    return Amount.fromRawAmount(this.pooledTokens[outIndex], JSBI.subtract(outAmount, fee))
  }

  public calculateRemoveLiquidity(amount: Amount<Token>): Amount<Token>[] {
    invariant(JSBI.lessThanOrEqual(amount.quotient, this.totalSupply.quotient), 'Cannot exceed total supply')

    return this.balances.map(
      (balance, i) =>
        Amount.fromRawAmount(
          this.pooledTokens[i],
          JSBI.divide(JSBI.multiply(balance.quotient, amount.quotient), this.totalSupply.quotient),
        ),
    )
  }

  public calculateRemoveLiquidityOneToken(
    amount: Amount<Token>,
    index: number,
  ): [Amount<Token>, Amount<Token>] {
    invariant(index < this.pooledTokens.length, 'indexOutOfRange')
    const amp = this.APrecise
    const xp = this.xp
    const D0 = this._getD(xp, amp)
    const D1 = JSBI.subtract(D0, JSBI.divide(JSBI.multiply(amount.quotient, D0), this.totalSupply.quotient))
    const newY = this._getYD(amp, index, xp, D1)
    const reducedXP = xp
    const _fee = this._feePerToken

    for (let i = 0; i < this.pooledTokens.length; i++) {
      let expectedDx = ZERO

      if (i === index)
        expectedDx = JSBI.subtract(JSBI.divide(JSBI.multiply(xp[i], D1), D0), newY)

      else
        expectedDx = JSBI.subtract(xp[i], JSBI.divide(JSBI.multiply(xp[i], D1), D0))

      reducedXP[i] = JSBI.subtract(
        reducedXP[i],
        JSBI.divide(JSBI.multiply(_fee, expectedDx), FEE_DENOMINATOR),
      )
    }

    let dy = JSBI.subtract(reducedXP[index], this._getYD(amp, index, reducedXP, D1))

    dy = JSBI.divide(JSBI.subtract(dy, ONE), this.tokenMultipliers[index])
    const fee = JSBI.subtract(
      JSBI.divide(JSBI.subtract(xp[index], newY), this.tokenMultipliers[index]),
      dy,
    )

    return [
      Amount.fromRawAmount(this.pooledTokens[index], dy),
      Amount.fromRawAmount(this.pooledTokens[index], fee),
    ]
  }
}
