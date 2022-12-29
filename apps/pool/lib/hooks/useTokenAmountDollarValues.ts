import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Type } from '@zenlink-interface/currency'
import { usePrices } from '@zenlink-interface/shared'
import { ZERO } from '@zenlink-interface/math'
import { useMemo } from 'react'

interface Params {
  chainId: ParachainId
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
