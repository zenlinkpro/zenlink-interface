import type { Pool } from '@zenlink-interface/graph-client'
import type { FC } from 'react'
import { Trans } from '@lingui/macro'
import { formatUSD } from '@zenlink-interface/format'
import { useTokensFromPool } from '@zenlink-interface/shared'

import { Currency, Typography } from '@zenlink-interface/ui'
import { usePoolPositionStaked } from 'components/PoolPositionStakedProvider'

interface PoolPositionStakedDesktopProps {
  pool: Pool
}

export const PoolPositionStakedDesktop: FC<PoolPositionStakedDesktopProps> = ({ pool }) => {
  const { tokens } = useTokensFromPool(pool)
  const { underlyings, values, isError, isLoading } = usePoolPositionStaked()

  if (isLoading && !isError) {
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex justify-between mb-1 py-0.5">
          <div className="h-[16px] bg-slate-600 animate-pulse w-[100px] rounded-full" />
          <div className="h-[16px] bg-slate-600 animate-pulse w-[60px] rounded-full" />
        </div>
        <div className="flex justify-between py-0.5">
          <div className="h-[16px] bg-slate-700 animate-pulse w-[160px] rounded-full" />
          <div className="h-[16px] bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
        <div className="flex justify-between py-0.5">
          <div className="h-[16px] bg-slate-700 animate-pulse w-[160px] rounded-full" />
          <div className="h-[16px] bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
      </div>
    )
  }

  if (!isLoading && !isError) {
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex items-center justify-between">
          <Typography className="text-slate-900 dark:text-slate-50 text-sm leading-5" weight={600}>
            <Trans>
              Staked Position
            </Trans>
          </Typography>
          <div className="flex flex-col">
            <Typography className="text-right text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
              {formatUSD(values.reduce((total, current) => total + current, 0))}
            </Typography>
          </div>
        </div>
        {tokens.map((token, i) => (
          <div className="flex items-center justify-between" key={token.wrapped.address}>
            <div className="flex items-center gap-2">
              <Currency.Icon currency={token} height={20} width={20} />
              <Typography className="text-slate-700 dark:text-slate-300" variant="sm" weight={600}>
                {underlyings[i]?.toSignificant(6)} {token.symbol}
              </Typography>
            </div>
            <Typography className="text-slate-600 dark:text-slate-400" variant="xs" weight={500}>
              {formatUSD(values[i])}
            </Typography>
          </div>
        ))}
      </div>
    )
  }

  return <></>
}
