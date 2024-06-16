import type { AggregatorTrade } from '@zenlink-interface/amm'
import type { Token, Type } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import type { JSBI } from '@zenlink-interface/math'
import { ZERO } from '@zenlink-interface/math'
import { useSettings } from '@zenlink-interface/shared'
import { getMarketActionRouterContract } from '@zenlink-interface/wagmi'
import { useAggregationTrade } from 'lib/hooks'
import type { FC, ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

interface TradeContext {
  isLoading: boolean
  isSyncing: boolean
  isError: boolean
  trade: AggregatorTrade | undefined
  amountSpecified: Amount<Type> | undefined
  lpMinted: Amount<Token>
  ytMinted: Amount<Token>
  guess: JSBI
}

const Context = createContext<TradeContext | undefined>(undefined)

interface TradeProviderProps {
  market: Market
  amountSpecified: Amount<Type> | undefined
  currencyOut: Type | undefined
  zeroPriceImpactMode: boolean
  children: ReactNode
}

export const TradeProvider: FC<TradeProviderProps> = ({
  market,
  amountSpecified,
  currencyOut,
  zeroPriceImpactMode,
  children,
}) => {
  const [{ slippageTolerance }] = useSettings()

  const isToUseAggregationTrade = useMemo(
    () => amountSpecified && currencyOut && !amountSpecified.currency.equals(currencyOut),
    [amountSpecified, currencyOut],
  )

  const { trade, isLoading, isError, isSyncing } = useAggregationTrade({
    enabled: Boolean(isToUseAggregationTrade),
    chainId: market.chainId,
    fromToken: amountSpecified?.currency,
    amount: amountSpecified,
    toToken: currencyOut,
    recipient: getMarketActionRouterContract(market.chainId).address,
    slippageTolerance,
  })

  const [lpMinted, ytMinted, guess] = useMemo(() => {
    try {
      if (!amountSpecified || (isToUseAggregationTrade && !trade))
        return [Amount.fromRawAmount(market, ZERO), Amount.fromRawAmount(market.YT, ZERO), ZERO]

      if (!isToUseAggregationTrade) {
        const netSyIn = market.SY.previewDeposit(amountSpecified.currency, amountSpecified)
        if (zeroPriceImpactMode) {
          return [...market.getAddLiquiditySingleSyKeepYt(netSyIn), ZERO]
        }
        else {
          const [lpMinted, guess] = market.getAddLiquiditySingleSy(netSyIn)
          return [lpMinted, Amount.fromRawAmount(market.YT, ZERO), guess]
        }
      }

      if (trade) {
        const netSyIn = market.SY.previewDeposit(trade.outputAmount.currency, trade.outputAmount)
        if (zeroPriceImpactMode) {
          return [...market.getAddLiquiditySingleSyKeepYt(netSyIn), ZERO]
        }
        else {
          const [lpMinted, guess] = market.getAddLiquiditySingleSy(netSyIn)
          return [lpMinted, Amount.fromRawAmount(market.YT, ZERO), guess]
        }
      }

      return [Amount.fromRawAmount(market, ZERO), Amount.fromRawAmount(market.YT, ZERO), ZERO]
    }
    catch {
      return [Amount.fromRawAmount(market, ZERO), Amount.fromRawAmount(market.YT, ZERO), ZERO]
    }
  }, [amountSpecified, isToUseAggregationTrade, market, trade, zeroPriceImpactMode])

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          isError: isToUseAggregationTrade ? isError : false,
          isLoading: isToUseAggregationTrade ? isLoading : false,
          isSyncing: isToUseAggregationTrade ? isSyncing : false,
          trade,
          amountSpecified,
          lpMinted,
          ytMinted,
          guess,
        }),
        [amountSpecified, guess, isError, isLoading, isSyncing, isToUseAggregationTrade, lpMinted, trade, ytMinted],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export function useTrade() {
  const context = useContext(Context)
  if (!context)
    throw new Error('Hook can only be used inside Market add zap Context')

  return context
}
