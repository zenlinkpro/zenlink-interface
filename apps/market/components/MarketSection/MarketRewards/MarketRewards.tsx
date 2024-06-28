import { Trans } from '@lingui/macro'
import type { Market } from '@zenlink-interface/market'
import { Button, Dots, Typography } from '@zenlink-interface/ui'
import { useMarketRewards, useYtInterestAndRewards } from '@zenlink-interface/wagmi'
import type { FC } from 'react'
import { YtInterestAndRewards } from './YtInterestAndRewards'
import { MarketRewardsReviewModal } from './MarketRewardsReviewModal'
import { MarketLPRewards } from './MarketLPRewards'

interface MarketRewardsProps {
  market: Market
}

export const MarketRewards: FC<MarketRewardsProps> = ({ market }) => {
  const { data: ytData, isLoading: isYtLoading } = useYtInterestAndRewards(market.chainId, [market])
  const { data: lpRewardsData, isLoading: isLpRewardsLoading } = useMarketRewards(market.chainId, [market])

  return (
    <div className="flex flex-col shadow-sm border border-slate-500/20 bg-white/50 dark:bg-slate-700/50 rounded-2xl shadow-white/30 dark:shadow-black/30">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-500/20 dark:border-slate-200/5">
        <Typography className="text-slate-900 dark:text-slate-50" weight={600}>
          <Trans>My Rewards</Trans>
        </Typography>
        <MarketRewardsReviewModal
          chainId={market.chainId}
          lpRewardsData={lpRewardsData?.[0]}
          market={market}
          ytData={ytData?.[0]}
        >
          {({ isWritePending, setOpen, disabled }) => (
            <Button disabled={isWritePending || disabled} onClick={() => setOpen(true)} size="xs">
              {isWritePending ? <Dots><Trans>Confirm</Trans></Dots> : <Trans>Redeem All</Trans>}
            </Button>
          )}
        </MarketRewardsReviewModal>
      </div>
      <YtInterestAndRewards data={ytData?.[0]} isLoading={isYtLoading} market={market} />
      <MarketLPRewards data={lpRewardsData?.[0]} isLoading={isLpRewardsLoading} market={market} showBoostButton />
    </div>
  )
}
