import type { AggregatorTrade } from '@zenlink-interface/amm'
import type { Token, Type } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import { ZERO } from '@zenlink-interface/math'
import { useSettings } from '@zenlink-interface/shared'
import { getMarketActionRouterContract } from '@zenlink-interface/wagmi'
import { useAggregationTrade } from 'lib/hooks'
import type { FC, ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

interface MintTradeContext {
  isLoading: boolean
  isSyncing: boolean
  isError: boolean
  trade: AggregatorTrade | undefined
  amountSpecified: Amount<Type> | undefined
  ptMinted: Amount<Token>
  ytMinted: Amount<Token>
}

const Context = createContext<MintTradeContext | undefined>(undefined)

interface MintTradeProviderProps {
  market: Market
  amountSpecified: Amount<Type> | undefined
  currencyOut: Type | undefined
  children: ReactNode
}

export const MintTradeProvider: FC<MintTradeProviderProps> = ({
  market,
  amountSpecified,
  currencyOut,
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

  const [ptMinted, ytMinted] = useMemo(() => {
    if (!amountSpecified || (isToUseAggregationTrade && !trade))
      return [Amount.fromRawAmount(market.PT, ZERO), Amount.fromRawAmount(market.YT, ZERO)]

    if (!isToUseAggregationTrade) {
      const syToMints = market.SY.previewDeposit(amountSpecified.currency, amountSpecified)
      return market.YT.getPYMinted(syToMints)
    }

    if (trade) {
      const syToMints = market.SY.previewDeposit(trade.outputAmount.currency, trade.outputAmount)
      return market.YT.getPYMinted(syToMints)
    }

    return [Amount.fromRawAmount(market.PT, ZERO), Amount.fromRawAmount(market.YT, ZERO)]
  }, [amountSpecified, isToUseAggregationTrade, market.PT, market.SY, market.YT, trade])

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          isError: isToUseAggregationTrade ? isError : false,
          isLoading: isToUseAggregationTrade ? isLoading : false,
          isSyncing: isToUseAggregationTrade ? isSyncing : false,
          trade,
          amountSpecified,
          ptMinted,
          ytMinted,
        }),
        [amountSpecified, isError, isLoading, isSyncing, isToUseAggregationTrade, ptMinted, trade, ytMinted],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export function useMintTrade() {
  const context = useContext(Context)
  if (!context)
    throw new Error('Hook can only be used inside Market mint Context')

  return context
}
