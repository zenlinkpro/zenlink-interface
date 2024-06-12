import { useAccount } from '@zenlink-interface/compat'
import type { Amount, Type } from '@zenlink-interface/currency'
import { type Market, Trade } from '@zenlink-interface/market'
import { useSettings } from '@zenlink-interface/shared'
import { getMarketActionRouterContract } from '@zenlink-interface/wagmi'
import { type UseTradeOutput, useAggregationTrade, useTrade as useMarketTrade } from 'lib/hooks'
import type { FC, ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

interface TradeContext extends UseTradeOutput {
  isLoading: boolean
  isSyncing: boolean
  isError: boolean
}

const Context = createContext<TradeContext | undefined>(undefined)

interface TradeProviderProps {
  market: Market
  amountSpecified: Amount<Type> | undefined
  currencyOut: Type | undefined
  children: ReactNode
}

export const TradeProvider: FC<TradeProviderProps> = ({
  market,
  amountSpecified,
  currencyOut,
  children,
}) => {
  const [{ slippageTolerance }] = useSettings()
  const { address } = useAccount()

  const isToUseAggregationTrade = useMemo(
    () => amountSpecified && currencyOut && (
      !market.isTokenIncludedInMarket(amountSpecified.currency.wrapped)
      || !market.isTokenIncludedInMarket(currencyOut.wrapped)
    ),
    [amountSpecified, currencyOut, market],
  )

  const aggregationTradeParams = useMemo(() => {
    if (isToUseAggregationTrade && amountSpecified && currencyOut) {
      const { fromToken, toToken, amount, recipient } = Trade.getAggregationTradeParams(
        market,
        amountSpecified,
        currencyOut,
        getMarketActionRouterContract(market.chainId).address,
        address,
      )

      return {
        fromToken,
        toToken,
        amount,
        recipient,
      }
    }

    return undefined
  }, [address, amountSpecified, currencyOut, isToUseAggregationTrade, market])

  const { trade: aggregatorTrade, isLoading, isError, isSyncing } = useAggregationTrade({
    enabled: Boolean(isToUseAggregationTrade && aggregationTradeParams),
    chainId: market.chainId,
    fromToken: aggregationTradeParams?.fromToken,
    amount: aggregationTradeParams?.amount,
    toToken: aggregationTradeParams?.toToken,
    recipient: aggregationTradeParams?.recipient,
    slippageTolerance,
  })

  const { trade } = useMarketTrade(market, amountSpecified, currencyOut, aggregatorTrade)

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          isError: isToUseAggregationTrade ? isError : false,
          isLoading: isToUseAggregationTrade ? isLoading : false,
          isSyncing: isToUseAggregationTrade ? isSyncing : false,
          trade,
        }),
        [isError, isLoading, isSyncing, isToUseAggregationTrade, trade],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export function useTrade() {
  const context = useContext(Context)
  if (!context)
    throw new Error('Hook can only be used inside Market swap Context')

  return context
}
