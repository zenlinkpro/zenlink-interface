import { Trans } from '@lingui/macro'
import { useAccount } from '@zenlink-interface/compat'
import type { Market } from '@zenlink-interface/market'
import { Typography } from '@zenlink-interface/ui'
import { useYtInterestAndRewards } from '@zenlink-interface/wagmi'
import type { FC } from 'react'
import { YtInterestAndRewards } from './YtInterestAndRewards'

interface MarketRewardsProps {
  market: Market
}

export const MarketRewards: FC<MarketRewardsProps> = ({ market }) => {
  const { address } = useAccount()

  const {
    data,
    isLoading: isYtLoading,
    isError: isYtError,
  } = useYtInterestAndRewards(market.chainId, [market], address, { enabled: true })

  return (
    <div className="flex flex-col shadow-sm border border-slate-500/20 bg-white dark:bg-slate-800 rounded-2xl shadow-white/30 dark:shadow-black/30">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-500/20 dark:border-slate-200/5">
        <Typography className="text-slate-900 dark:text-slate-50" weight={600}>
          <Trans>My Rewards</Trans>
        </Typography>
      </div>
      <YtInterestAndRewards data={data?.[0]} isError={isYtError} isLoading={isYtLoading} />
    </div>
  )
}
