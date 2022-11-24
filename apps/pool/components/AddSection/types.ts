import type { Amount, Token } from '@zenlink-interface/currency'

export interface CalculatedStbaleSwapLiquidity {
  amount?: Amount<Token>
  baseAmounts: Amount<Token>[]
  metaAmounts: Amount<Token>[]
}
