import { formatNumber } from '@zenlink-interface/format'
import { POOL_TYPE } from '@zenlink-interface/graph-client'
import { Currency, NetworkIcon, RewardIcon, Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { isPoolEnabledFarms, useTokensFromPool } from '@zenlink-interface/shared'
import { ICON_SIZE } from '../../constants'

import type { CellProps } from './types'

export const PairNameCell: FC<CellProps> = ({ row }) => {
  const { tokens, liquidityToken } = useTokensFromPool(row.pool)

  return (
    <div className="flex items-center gap-3 sm:gap-0">
      <div className="hidden sm:flex">
        {row.type === POOL_TYPE.STANDARD_POOL
          ? (
            <Currency.IconList iconWidth={ICON_SIZE} iconHeight={ICON_SIZE}>
              {tokens.map(token => <Currency.Icon disableLink key={token.wrapped.address} currency={token} />)}
            </Currency.IconList>
            )
          : (
            <div className="mr-[26px]">
              <Currency.Icon disableLink width={ICON_SIZE} height={ICON_SIZE} currency={liquidityToken} />
            </div>
            )}
      </div>
      <div className="flex sm:hidden">
        <NetworkIcon chainId={row.pool.chainId} width={ICON_SIZE} height={ICON_SIZE} />
      </div>
      <div className="flex flex-col">
        <Typography variant="sm" weight={500} className="flex items-center gap-1 text-slate-900 dark:text-slate-50">
          {row.type === POOL_TYPE.STANDARD_POOL
            ? <>{tokens[0].symbol} <span className="text-slate-500">/</span> {tokens[1].symbol}{' '}</>
            : <>{row.pool.name}{' '}</>}
          {row.type !== POOL_TYPE.SINGLE_TOKEN_POOL && (
            <div className="bg-slate-300 dark:bg-slate-700 rounded-lg px-1 py-0.5 text-xs ml-1">
              {row.type === POOL_TYPE.STANDARD_POOL ? formatNumber(30 / 100) : formatNumber(5 / 100)}
              %
            </div>
          )}
          {isPoolEnabledFarms(row.pool) && (
            <div className="bg-green-500/50 rounded-lg flex items-center justify-center w-6 h-5 ml-1">
              <RewardIcon width={16} height={16} className="-mt-0.5" />
            </div>
          )}
        </Typography>
        <Typography variant="xxs" className="text-slate-600 dark:text-slate-400">
          {row.type === POOL_TYPE.STANDARD_POOL
            ? 'Standard'
            : row.type === POOL_TYPE.SINGLE_TOKEN_POOL
              ? 'Single'
              : 'Stable'}
        </Typography>
      </div>
    </div>
  )
}
