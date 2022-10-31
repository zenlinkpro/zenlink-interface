import type { TradeType } from '@zenlink-interface/amm'
import type { Amount, Type } from '@zenlink-interface/currency'
import { useTrade as useFindTrade } from 'lib/hooks'
import type { UseTradeOutput } from 'lib/hooks'
import type { FC, ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

interface TradeContext extends UseTradeOutput {
  isLoading: boolean
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
  const { trade, route } = useFindTrade(chainId, tradeType, amountSpecified, mainCurrency, otherCurrency)
  return (
    <Context.Provider value={useMemo(() => ({ trade, route, isError: false, isLoading: false }), [route, trade])}>
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
