import chains from '@zenlink-interface/chain'
import { formatPercent, formatUSD } from '@zenlink-interface/format'
import type { Pool } from '@zenlink-interface/graph-client'
import { POOL_TYPE } from '@zenlink-interface/graph-client'
import { AppearOnMount, Currency, Link, NetworkIcon, Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { usePrices, useTokensFromPool } from '@zenlink-interface/shared'
import { Trans } from '@lingui/macro'

interface PoolHeaderProps {
  pool: Pool
}

export const PoolHeader: FC<PoolHeaderProps> = ({ pool }) => {
  const { data: prices } = usePrices({ chainId: pool.chainId })
  const { tokens, liquidityToken } = useTokensFromPool(pool)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex gap-1 items-center">
          <NetworkIcon type="naked" chainId={pool.chainId} width={16} height={16} />
          <Typography variant="xs" className="text-slate-500">
            {chains[pool.chainId].name}
          </Typography>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex">
            {pool.type === POOL_TYPE.STANDARD_POOL
              ? (
                <Currency.IconList iconWidth={44} iconHeight={44}>
                  {tokens.map(token => <Currency.Icon key={token.wrapped.address} currency={token} />)}
                </Currency.IconList>
                )
              : (
                <div className="mr-[26px]">
                  <Currency.Icon currency={liquidityToken} width={44} height={44} />
                </div>
                )
            }
            <Link.External
              className="flex flex-col !no-underline group"
              href={chains[pool.chainId].getTokenUrl(liquidityToken.wrapped.address)}
            >
              <div className="flex items-center gap-2">
                <Typography
                  variant="lg"
                  className="flex items-center gap-1 text-slate-900 dark:text-slate-50 group-hover:text-blue-400"
                  weight={600}
                >
                  {pool.type === POOL_TYPE.STANDARD_POOL ? `${tokens[0].symbol}/${tokens[1].symbol}` : `${pool.name}`}
                  <ArrowTopRightOnSquareIcon width={20} height={20} className="text-slate-600 dark:text-slate-400 group-hover:text-blue-400" />
                </Typography>
              </div>
              <Typography variant="xs" className="text-slate-700 dark:text-slate-300">
                <Trans>Fee: {pool.type === POOL_TYPE.STANDARD_POOL ? 0.3 : 0.05}%</Trans>
              </Typography>
            </Link.External>
          </div>
          <div className="flex flex-col gap-1">
            <Typography weight={400} as="span" className="text-slate-600 dark:text-slate-400 sm:text-right">
              <Trans>Best APR: </Trans> <span className="font-semibold text-slate-900 dark:text-slate-50">{formatPercent(pool.apr)}</span>
            </Typography>
            <div className="flex gap-2">
              <Typography variant="sm" weight={400} as="span" className="text-slate-600 dark:text-slate-400">
                <Trans>Best Rewards: {formatPercent(pool.bestStakeApr)}</Trans>
              </Typography>
              <Typography variant="sm" weight={400} as="span" className="text-slate-600 dark:text-slate-400">
                <Trans>Fees: {formatPercent(pool.feeApr)}</Trans>
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tokens.map(token => (
          <div
            className="flex gap-3 p-3 rounded-lg shadow-sm border border-slate-500/20 bg-white dark:bg-slate-800 shdow-white/10 dark:shadow-black/10"
            key={token.wrapped.address}
          >
            <Currency.Icon currency={token} width={20} height={20} />
            <Typography variant="sm" weight={600} className="text-slate-700 dark:text-slate-300">
              <AppearOnMount>
                {token.symbol} ={' '}
                {prices?.[token.wrapped.address]
                  ? formatUSD(Number(prices[token.wrapped.address].toSignificant(6)))
                  : '$0.00'}
              </AppearOnMount>
            </Typography>
          </div>
        ))}
      </div>
    </div>
  )
}
