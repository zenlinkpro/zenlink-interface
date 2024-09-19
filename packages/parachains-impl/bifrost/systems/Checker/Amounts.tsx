import type { Amount, Type } from '@zenlink-interface/currency'
import type { FC } from 'react'
import type { CheckerButton } from './types'
import { ZERO } from '@zenlink-interface/math'
import { useAccount } from '@zenlink-interface/polkadot'
import { Button } from '@zenlink-interface/ui'

import { useMemo } from 'react'
import { useBalances } from '../../hooks'

export interface AmountsProps extends CheckerButton {
  chainId: number | undefined
  amounts: (Amount<Type> | undefined)[]
}

export const Amounts: FC<AmountsProps> = ({
  amounts,
  chainId,
  children,
  className,
  variant,
  fullWidth,
  as,
  size,
}) => {
  const { address } = useAccount()
  const amountsAreDefined = useMemo(() => Boolean(amounts.length && amounts.every(el => el?.greaterThan(ZERO))), [amounts])
  const currencies = useMemo(() => amounts.map(amount => amount?.currency), [amounts])

  const { data: balances } = useBalances({
    currencies,
    chainId,
    account: address,
  })

  const sufficientBalance = useMemo(() => {
    return amounts?.every((amount) => {
      if (!amount)
        return true
      return !balances
        ?.[amount.currency.wrapped.address]
        ?.lessThan(amount)
    })
  }, [amounts, balances])

  return useMemo(() => {
    if (!amountsAreDefined) {
      return (
        <Button as={as} className={className} disabled fullWidth={fullWidth} size={size} variant={variant}>
          Enter Amount
        </Button>
      )
    }

    if (!sufficientBalance) {
      return (
        <Button as={as} className={className} disabled fullWidth={fullWidth} size={size} variant={variant}>
          Insufficient Balance
        </Button>
      )
    }

    return <>{children}</>
  }, [amountsAreDefined, as, children, className, fullWidth, size, sufficientBalance, variant])
}
