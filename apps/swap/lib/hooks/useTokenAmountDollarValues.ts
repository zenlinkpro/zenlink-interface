import type { Amount, Type } from '@zenlink-interface/currency'
import { ZERO } from '@zenlink-interface/math'
import { usePrices } from '@zenlink-interface/shared'
import { useMemo } from 'react'

interface Params {
  chainId: number | undefined
  amounts: (Amount<Type> | undefined)[]
}

type UseTokenAmountDollarValues = (params: Params) => number[]

export const useTokenAmountDollarValues: UseTokenAmountDollarValues = ({ chainId, amounts }) => {
  const { data: prices } = usePrices({ chainId })

  return useMemo(() => {
    return amounts.map((amount) => {
      if (!amount?.greaterThan(ZERO) || !prices?.[amount.currency.wrapped.address])
        return 0
      const price = Number(Number(amount.toExact()) * Number(prices[amount.currency.wrapped.address].toFixed(10)))

      if (isNaN(price) || price < 0.000001)
        return 0

      return price
    })
  }, [amounts, prices])
}
