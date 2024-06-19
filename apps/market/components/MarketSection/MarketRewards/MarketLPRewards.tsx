import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import type { Amount, Token } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import { Button, Currency, Dots, Tooltip, Typography } from '@zenlink-interface/ui'
import { useBoostMarketsReview } from '@zenlink-interface/wagmi'
import { useIsBoosted } from 'lib/hooks'
import { type FC, useMemo } from 'react'

interface MarketLPRewardsProps {
  isLoading: boolean
  isError: boolean
  data: Amount<Token>[] | undefined
  showBoostButton: boolean
  market: Market
}

export const MarketLPRewards: FC<MarketLPRewardsProps> = ({
  data,
  isLoading,
  isError,
  market,
  showBoostButton,
}) => {
  const isBoosted = useIsBoosted(market)

  const rewards = useMemo(() => {
    if (!data)
      return []
    return data.filter(reward => reward.greaterThan(0))
  }, [data])

  const { isWritePending, sendTransaction } = useBoostMarketsReview({
    chainId: market.chainId,
    markets: [market],
    enabled: showBoostButton,
  })

  if (isLoading && !isError) {
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

  if (!isLoading && !isError && rewards.length) {
    return (
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="flex items-center justify-between">
          <Typography className="text-slate-900 dark:text-slate-50 text-sm leading-5" weight={600}>
            <Trans>
              Market LP Rewards
            </Trans>
          </Typography>
          {showBoostButton && (
            <Button
              color={isBoosted ? 'gray' : 'green'}
              disabled={isWritePending || isBoosted}
              endIcon={(
                <Tooltip content={(
                  <Typography className="text-slate-700 dark:text-slate-300 w-80" variant="xs" weight={500}>
                    <Trans>
                      If you lock veZLK before LPing, your LP will be automatically boosted.
                      If you lock veZLK after LPing, you will have to manually apply the boost.
                    </Trans>
                  </Typography>
                )}
                >
                  <InformationCircleIcon height={14} width={14} />
                </Tooltip>
              )}
              onClick={() => sendTransaction?.()}
              size="xs"
            >
              {isWritePending
                ? <Dots><Trans>Confirm</Trans></Dots>
                : isBoosted
                  ? <Trans>Boosted</Trans>
                  : <Trans>Boost</Trans>}
            </Button>
          )}
        </div>
        {rewards.map(reward => (
          <div className="flex items-center justify-between" key={reward.currency.wrapped.address}>
            <div className="flex items-center gap-2">
              <Currency.Icon currency={reward.currency} height={20} width={20} />
              <Typography className="text-slate-700 dark:text-slate-300" variant="sm" weight={600}>
                {reward?.toSignificant(6)} {reward.currency.symbol}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return <></>
}
