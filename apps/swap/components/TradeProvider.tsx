import type { TradeType } from '@zenlink-interface/amm'
import type { Amount, Type } from '@zenlink-interface/currency'
import { useAggregatorTrade, useTrade as useSingleTrade } from 'lib/hooks'
import type { UseTradeOutput } from 'lib/hooks'
import type { FC, ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'
import { AGGREGATOR_ENABLED_NETWORKS } from 'config'

interface TradeContext extends UseTradeOutput {
  isLoading: boolean
  isSyncing: boolean
  isError: boolean
}

const Context = createContext<TradeContext | undefined>(undefined)

interface TradeProviderProps {
  chainId: number | undefined
  tradeType: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT
  amountSpecified: Amount<Type> | undefined
  mainCurrency: Type | undefined
  otherCurrency: Type | undefined
  children: ReactNode
}

export const TradeProvider: FC<TradeProviderProps> = ({
  chainId,
  tradeType,
  amountSpecified,
  mainCurrency,
  otherCurrency,
  children,
}) => {
  // TODO: user settings
  const [perferToUseSplitTrade] = useState(true)
  const toUseSplitTrade = useMemo(
    () => Boolean(chainId && perferToUseSplitTrade && AGGREGATOR_ENABLED_NETWORKS.includes(chainId)),
    [chainId, perferToUseSplitTrade],
  )

  const { trade: singleTrade } = useSingleTrade(chainId, tradeType, amountSpecified, mainCurrency, otherCurrency)
  const { trade: splitTrade, isLoading, isError, isSyncing } = useAggregatorTrade({
    chainId,
    fromToken: mainCurrency,
    toToken: otherCurrency,
    amount: amountSpecified,
    recipient: undefined,
    enabled: toUseSplitTrade,
  })

  return (
    <Context.Provider value={
      useMemo(
        () => ({
          trade: toUseSplitTrade ? splitTrade : singleTrade,
          isLoading: toUseSplitTrade ? isLoading : false,
          isSyncing: toUseSplitTrade ? isSyncing : false,
          isError: toUseSplitTrade ? isError : false,
        }),
        [isError, isLoading, isSyncing, singleTrade, splitTrade, toUseSplitTrade],
      )
    }>
      {children}
    </Context.Provider>
  )
}

export const useTrade = () => {
  const context = useContext(Context)
  if (!context)
    throw new Error('Hook can only be used inside Pool Position Staked Context')

  return context
}
