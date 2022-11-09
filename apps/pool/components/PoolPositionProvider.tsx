import type { Amount, Type } from '@zenlink-interface/currency'
import type { Pair } from '@zenlink-interface/graph-client'
import { useBalance } from '@zenlink-interface/wagmi'
import type { FC, ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { useTokenAmountDollarValues, useTokensFromPair, useUnderlyingTokenBalanceFromPair } from '../lib/hooks'

interface PoolPositionContext {
  balance: Amount<Type> | undefined
  value0: number
  value1: number
  underlying0: Amount<Type> | undefined
  underlying1: Amount<Type> | undefined
  isLoading: boolean
  isError: boolean
}

const Context = createContext<PoolPositionContext | undefined>(undefined)

export const PoolPositionProvider: FC<{ pair: Pair; children: ReactNode; watch?: boolean }> = ({
  pair,
  children,
  watch = true,
}) => {
  const { address: account } = useAccount()
  const { reserve0, reserve1, totalSupply, liquidityToken } = useTokensFromPair(pair)

  const {
    data: balance,
    isLoading,
    isError,
  } = useBalance({ chainId: pair.chainId, currency: liquidityToken, account, watch })

  const underlying = useUnderlyingTokenBalanceFromPair({
    reserve0,
    reserve1,
    totalSupply,
    balance,
  })

  const [underlying0, underlying1] = underlying
  const [value0, value1] = useTokenAmountDollarValues({ chainId: pair.chainId, amounts: underlying })

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          balance,
          value0,
          value1,
          underlying0,
          underlying1,
          isLoading,
          isError,
        }),
        [balance, isError, isLoading, underlying0, underlying1, value0, value1],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const usePoolPosition = () => {
  const context = useContext(Context)
  if (!context)
    throw new Error('Hook can only be used inside Pool Position Context')

  return context
}
