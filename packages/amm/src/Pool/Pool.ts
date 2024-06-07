import type { Amount, Token } from '@zenlink-interface/currency'
import type { JSBI } from '@zenlink-interface/math'

import type { Fee } from '../Fee'
import type { MultiPath } from '../MultiRoute'
import type { Pair } from '../Pair'

export abstract class Pool {
  public abstract readonly swapGasCost: JSBI

  // Minimum pool liquidity, typically 1000
  public abstract readonly minLiquidity: JSBI

  public abstract get chainId(): number

  public abstract get fee(): Fee

  public abstract get token0(): Token

  public abstract get token1(): Token

  public abstract get reserve0(): Amount<Token>

  public abstract get reserve1(): Amount<Token>

  public abstract involvesToken(token: Token): boolean

  public abstract pathOf(token: Token): MultiPath

  public abstract getOutputAmount(inputAmount: Amount<Token>): [Amount<Token>] | [Amount<Token>, Pair]
}
