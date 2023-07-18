import { formatUSD } from '@zenlink-interface/format'
import { Currency, Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import React from 'react'
import { Trans } from '@lingui/macro'
import { usePoolPositionStaked } from '../../PoolPositionStakedProvider'

export const AddSectionMyPositionStaked: FC = () => {
  const { balance, values, underlyings, isError, isLoading } = usePoolPositionStaked()

  if (isLoading && !isError && !balance) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 justify-between items-center">
          <Typography variant="sm" weight={600} className="text-slate-900 dark:text-slate-50">
            <Trans>
              My Staked Position
            </Trans>
          </Typography>
          <div className="h-[16px] w-[40px] animate-pulse bg-slate-600 rounded-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center gap-1.5">
            <div className="h-[16px] w-[120px] bg-slate-700 animate-pulse rounded-full" />
            <div className="h-[16px] w-[40px] bg-slate-700 animate-pulse rounded-full" />
          </div>
          <div className="flex justify-between items-center gap-1.5">
            <div className="h-[16px] w-[120px] bg-slate-700 animate-pulse rounded-full" />
            <div className="h-[16px] w-[40px] bg-slate-700 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 justify-between items-center">
        <Typography variant="sm" weight={600} className="text-slate-900 dark:text-slate-50">
          <Trans>
            My Staked Position
          </Trans>
        </Typography>
        <Typography variant="xs" weight={500} className="text-slate-600 dark:text-slate-400">
          {formatUSD(values.reduce((total, current) => total + current, 0))}
        </Typography>
      </div>
      <div className="flex flex-col gap-1.5">
        {underlyings.map(amount => (
          <div className="flex items-center gap-1.5" key={amount.currency.wrapped.address}>
            <div className="w-4 h-4">
              {amount && <Currency.Icon currency={amount.currency} width={16} height={16} />}
            </div>
            <Typography variant="xs" weight={500} className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              {balance && amount?.toSignificant(6)} {amount?.currency.symbol}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  )
}
