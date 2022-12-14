import { formatUSD } from '@zenlink-interface/format'
import type { Pool } from '@zenlink-interface/graph-client'
import { Currency, Typography } from '@zenlink-interface/ui'
import { usePoolPosition } from 'components/PoolPositionProvider'
import { useTokensFromPool } from 'lib/hooks'
import type { FC } from 'react'

interface PoolPositionProps {
  pool: Pool
}

export const PoolPositionDesktop: FC<PoolPositionProps> = ({ pool }) => {
  const { tokens } = useTokensFromPool(pool)
  const { underlyings, values, isError, isLoading } = usePoolPosition()

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
        {tokens.map((token, i) => (
          <div className="flex items-center justify-between" key={token.wrapped.address}>
            <div className="flex items-center gap-2">
              <Currency.Icon currency={token} width={20} height={20} />
              <Typography variant="sm" weight={600} className="text-slate-300">
                {underlyings[i]?.toSignificant(6)} {token.symbol}
              </Typography>
            </div>
            <Typography variant="xs" weight={500} className="text-slate-400">
              {formatUSD(values[i])}
            </Typography>
          </div>
        ))}
      </div>
    )
  }

  return <></>
}
