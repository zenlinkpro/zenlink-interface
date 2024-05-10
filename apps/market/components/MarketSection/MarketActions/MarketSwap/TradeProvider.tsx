import type { Amount, Type } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import { type UseTradeOutput, useTrade as useMarketTrade } from 'lib/hooks'
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
  const { trade } = useMarketTrade(market, amountSpecified, currencyOut)

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          isError: false,
          isLoading: false,
          isSyncing: false,
          trade,
        }),
        [trade],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export function useTrade() {
  const context = useContext(Context)
  if (!context)
    throw new Error('Hook can only be used inside Pool Position Staked Context')

  return context
}
