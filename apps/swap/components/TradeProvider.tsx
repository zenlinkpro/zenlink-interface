import type { TradeType } from '@zenlink-interface/amm'
import type { Amount, Type } from '@zenlink-interface/currency'
import type { UseTradeOutput } from 'lib/hooks'
import type { FC, ReactNode } from 'react'
import { useAccount } from '@zenlink-interface/compat'
import { useSettings } from '@zenlink-interface/shared'
import { AGGREGATOR_ENABLED_NETWORKS } from 'config'
import { useAggregatorTrade, useTrade as useSingleTrade } from 'lib/hooks'
import { createContext, useContext, useMemo } from 'react'

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
  const [{ aggregator, slippageTolerance }] = useSettings()
  const { address } = useAccount()
  const toUseAggregator = useMemo(
    () => Boolean(chainId && aggregator && AGGREGATOR_ENABLED_NETWORKS.includes(chainId)),
    [aggregator, chainId],
  )

  const { trade: singleTrade } = useSingleTrade(
    chainId,
    tradeType,
    amountSpecified,
    mainCurrency,
    otherCurrency,
  )

  const { trade: aggregatorTrade, isLoading, isError, isSyncing } = useAggregatorTrade({
    amount: amountSpecified,
    chainId,
    enabled: toUseAggregator,
    fromToken: mainCurrency,
    recipient: address,
    slippageTolerance,
    toToken: otherCurrency,
  })

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          isError: toUseAggregator ? isError : false,
          isLoading: toUseAggregator ? isLoading : false,
          isSyncing: toUseAggregator ? isSyncing : false,
          trade: toUseAggregator ? aggregatorTrade : singleTrade,
        }),
        [aggregatorTrade, isError, isLoading, isSyncing, singleTrade, toUseAggregator],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export function useTrade() {
  const context = useContext(Context)
  if (!context)
    throw new Error('Hook can only be used inside Trade Context')

  return context
}
