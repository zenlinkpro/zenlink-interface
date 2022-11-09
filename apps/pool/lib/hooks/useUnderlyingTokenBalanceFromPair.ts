import type { Token, Type } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import { ZERO } from '@zenlink-interface/math'
import { useMemo } from 'react'

interface Params {
  totalSupply: Amount<Token> | undefined
  reserve0: Amount<Type> | undefined
  reserve1: Amount<Type> | undefined
  balance: Amount<Type> | undefined
}

type UseUnderlyingTokenBalanceFromPairParams = (params: Params) => [Amount<Type> | undefined, Amount<Type> | undefined]

export const useUnderlyingTokenBalanceFromPair: UseUnderlyingTokenBalanceFromPairParams = ({
  balance,
  totalSupply,
  reserve1,
  reserve0,
}) => {
  return useMemo(() => {
    if (!balance || !totalSupply || !reserve0 || !reserve1)
      return [undefined, undefined]

    if (totalSupply.equalTo(ZERO)) {
      return [
        Amount.fromRawAmount(reserve0.wrapped.currency, '0'),
        Amount.fromRawAmount(reserve1.wrapped.currency, '0'),
      ]
    }

    return [
      reserve0.wrapped.multiply(balance.wrapped.divide(totalSupply)),
      reserve1.wrapped.multiply(balance.wrapped.divide(totalSupply)),
    ]
  }, [balance, reserve0, reserve1, totalSupply])
}
