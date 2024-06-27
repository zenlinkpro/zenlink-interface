import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Amount, ZLK } from '@zenlink-interface/currency'
import { formatPercent } from '@zenlink-interface/format'
import type { MarketGraphData } from '@zenlink-interface/graph-client'
import type { Market } from '@zenlink-interface/market'
import { JSBI, Percent, ZERO } from '@zenlink-interface/math'
import { usePrices } from '@zenlink-interface/shared'
import { AppearOnMount, Tooltip, Typography } from '@zenlink-interface/ui'
import { useRewardData } from '@zenlink-interface/wagmi'
import { type FC, useMemo } from 'react'

interface MarketAPYProps {
  market: Market
  graphData: MarketGraphData | undefined
}

export const MarketAPY: FC<MarketAPYProps> = ({ market, graphData }) => {
  const { data: rewardData, isLoading } = useRewardData(market.chainId, market)
  const { data: prices } = usePrices({ chainId: market.chainId })

  const dailyPoolRewards = useMemo(() => {
    const zlkPerSec = rewardData?.zlkPerSec
    if (!zlkPerSec)
      return undefined

    return Amount.fromRawAmount(
      ZLK[market.chainId],
      JSBI.BigInt(JSBI.toNumber(zlkPerSec) * 3600 * 24),
    )
  }, [market.chainId, rewardData?.zlkPerSec])

  const totalAssets = JSBI.add(market.marketState.totalSy.quotient, market.marketState.totalPt.quotient)
  const syProportion = JSBI.greaterThan(totalAssets, ZERO)
    ? new Percent(market.marketState.totalSy.quotient, totalAssets)
    : new Percent(0)
  const ptProportion = JSBI.greaterThan(totalAssets, ZERO)
    ? new Percent(market.marketState.totalPt.quotient, totalAssets)
    : new Percent(0)
  const underlyingYieldAPY = (graphData?.underlyingAPY || 0) * Number(syProportion.asFraction.toSignificant(6))
  const ptYieldAPY = (graphData?.impliedAPY || 0) * Number(ptProportion.asFraction.toSignificant(6))

  const vloumeUSDOneWeek = (graphData?.marketDayData || [])
    .slice(0, 7)
    .reduce((total, current) => total + current.dailyFeeUSD, 0)

  const feeAPY = graphData && graphData.reserveUSD > 0
    ? (vloumeUSDOneWeek * 365) / (graphData.reserveUSD * 7)
    : 0

  const rewardAPY = prices && dailyPoolRewards && graphData
    ? Number(dailyPoolRewards?.toSignificant(6) || '0') * Number(prices[dailyPoolRewards.currency.wrapped.address].toSignificant(6)) * 365 / graphData.reserveUSD
    : 0

  const lpAPY = feeAPY + rewardAPY

  const myAPY = underlyingYieldAPY + ptYieldAPY + lpAPY

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center justify-between px-2">
        <Typography className="text-slate-900 dark:text-slate-50" weight={600}>
          <Trans>APY Breakdown</Trans>
        </Typography>
        <AppearOnMount>
          <Typography className="text-slate-600 dark:text-slate-400" variant="sm" weight={500}>
            <Trans>My APY</Trans>{': '}
            <span className="font-semibold text-slate-900 dark:text-slate-50">
              {' '}
              {formatPercent(myAPY)}
            </span>
          </Typography>
        </AppearOnMount>
      </div>
      <div className="flex flex-col bg-slate-50 dark:bg-slate-800 rounded-lg p-4 gap-4">
        <Typography
          className="bg-blue-500/20 text-blue-800 dark:text-blue-200 rounded-lg flex justify-between p-4"
          variant="sm"
          weight={600}
        >
          <div className="flex gap-2 items-center">
            <Trans>Underlying Yield</Trans>
            <Tooltip
              content={(
                <Typography className="text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
                  <Trans>
                    scaled to underlying asset proportion in pool
                  </Trans>
                </Typography>
              )}
            >
              <InformationCircleIcon height={14} width={14} />
            </Tooltip>
          </div>
          <span>{formatPercent(underlyingYieldAPY)}</span>
        </Typography>
        <Typography
          className="bg-green-500/20 text-green-800 dark:text-green-200 rounded-lg flex justify-between p-4"
          variant="sm"
          weight={600}
        >
          <div className="flex gap-2 items-center">
            <Trans>PT Yield</Trans>
            <Tooltip
              content={(
                <Typography className="text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
                  <Trans>
                    scaled to PT proportion in pool
                  </Trans>
                </Typography>
              )}
            >
              <InformationCircleIcon height={14} width={14} />
            </Tooltip>
          </div>
          <span>{formatPercent(ptYieldAPY)}</span>
        </Typography>
        <div className="bg-slate-500/20 text-slate-800 dark:text-slate-200 rounded-lg flex flex-col p-4">
          <Typography
            className="flex justify-between mb-2"
            variant="sm"
            weight={600}
          >
            <Trans>Zenlink LP Yield</Trans>
            <span>{formatPercent(lpAPY)}</span>
          </Typography>
          <Typography
            className="flex justify-between pl-4"
            variant="sm"
            weight={500}
          >
            <Trans>Trade Fee Yield</Trans>
            <span>{formatPercent(feeAPY)}</span>
          </Typography>
          <Typography
            className="flex justify-between pl-4"
            variant="sm"
            weight={500}
          >
            <Trans>Farming Yield</Trans>
            <span>{formatPercent(rewardAPY)}</span>
          </Typography>
        </div>
        <hr className="my-2 border-t border-slate-500/20 dark:border-slate-200/5" />
        <div className="text-slate-700 dark:text-slate-300 flex justify-between px-2 mb-2">
          <div className="flex items-center gap-2">
            <Typography variant="sm" weight={600}>
              <Trans>Est. Daily Pool Rewards</Trans>
            </Typography>
            <Tooltip
              content={(
                <Typography className="text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
                  <Trans>
                    based on veZLK votes, updated every Thursday
                  </Trans>
                </Typography>
              )}
            >
              <InformationCircleIcon height={14} width={14} />
            </Tooltip>
          </div>
          <Typography variant="sm" weight={600}>
            <AppearOnMount>
              {
                isLoading
                  ? <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-[40px] h-[20px] animate-pulse" />
                  : <>{dailyPoolRewards?.toSignificant(6) || '0'} {dailyPoolRewards?.currency.symbol}</>
              }
            </AppearOnMount>
          </Typography>
        </div>
      </div>
    </div>
  )
}
