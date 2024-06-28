import { Trans } from '@lingui/macro'
import type { Market } from '@zenlink-interface/market'
import { Currency, Typography } from '@zenlink-interface/ui'
import type { YtInterestAndRewardsResult } from '@zenlink-interface/wagmi'
import { type FC, useMemo } from 'react'

interface YtInterestAndRewardsProps {
  isLoading: boolean
  data: YtInterestAndRewardsResult | undefined
  market: Market
}

export const YtInterestAndRewards: FC<YtInterestAndRewardsProps> = ({ data, isLoading, market }) => {
  const rewards = useMemo(() => {
    if (!data)
      return []
    const rewardsGtZero = data.rewards.filter(reward => reward.greaterThan(0))
    if (!data.interest || data.interest.equalTo(0))
      return rewardsGtZero
    return [data.interest, ...rewardsGtZero]
  }, [data])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex justify-between mb-1 py-0.5">
          <div className="h-[16px] bg-slate-300 dark:bg-slate-700 animate-pulse w-[100px] rounded-full" />
          <div className="h-[16px] bg-slate-300 dark:bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
        <div className="flex justify-between py-0.5">
          <div className="h-[16px] bg-slate-300 dark:bg-slate-700 animate-pulse w-[160px] rounded-full" />
          <div className="h-[16px] bg-slate-300 dark:bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
        <div className="flex justify-between py-0.5">
          <div className="h-[16px] bg-slate-300 dark:bg-slate-700 animate-pulse w-[160px] rounded-full" />
          <div className="h-[16px] bg-slate-300 dark:bg-slate-700 animate-pulse w-[60px] rounded-full" />
        </div>
      </div>
    )
  }

  if (!isLoading) {
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex items-center justify-between">
          <Typography className="text-slate-900 dark:text-slate-50 text-sm leading-5" weight={600}>
            <Trans>
              YT Interest And Rewards
            </Trans>
          </Typography>
        </div>
        {rewards.length
          ? rewards.map(reward => (
            <div className="flex items-center justify-between" key={reward.currency.wrapped.address}>
              <div className="flex items-center gap-2">
                <Currency.Icon currency={reward.currency} height={20} width={20} />
                <Typography className="text-slate-700 dark:text-slate-300" variant="sm" weight={600}>
                  {reward?.toSignificant(6)} {reward.currency.symbol}
                </Typography>
              </div>
            </div>
          ))
          : (
            <div className="flex items-center gap-2">
              <Currency.Icon currency={market.SY} height={20} width={20} />
              <Typography className="text-slate-700 dark:text-slate-300" variant="sm" weight={600}>
                0 {market.SY.symbol}
              </Typography>
            </div>
            )}
      </div>
    )
  }

  return <></>
}
