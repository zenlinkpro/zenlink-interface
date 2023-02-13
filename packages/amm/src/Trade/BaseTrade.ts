import type { Amount, Currency, Price, Token } from '@zenlink-interface/currency'
import type { Percent } from '@zenlink-interface/math'
import type { TradeVersion } from './TradeVersion'

export interface RouteDescription {
  input: Currency
  output: Currency
  fee: number
  liquidityToken?: Token
  poolType: 'Stable' | 'Standard' | 'Unknown'
  percent: number
}

export interface BaseTrade {
  chainId: number
  inputAmount: Amount<Currency>
  outputAmount: Amount<Currency>
  executionPrice: Price<Currency, Currency>
  priceImpact: Percent
  version: TradeVersion
  descriptions: RouteDescription[]
}
