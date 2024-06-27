import { HandRaisedIcon, InformationCircleIcon, WalletIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { ParachainId } from '@zenlink-interface/chain'
import { formatTransactionAmount } from '@zenlink-interface/format'
import { usePrices } from '@zenlink-interface/shared'
import { Button, Dots, Tooltip, Typography } from '@zenlink-interface/ui'
import {
  type MarketPosition,
  useBoostMarketsReview,
  useMarketRewards,
  useRedeemRewardsReview,
  useYtInterestAndRewards,
} from '@zenlink-interface/wagmi'
import { type FC, useMemo } from 'react'

interface PositionDashboardParams {
  positions: MarketPosition[]
}

export const PositionDashboard: FC<PositionDashboardParams> = ({ positions }) => {
  const { data: tokenPrices } = usePrices({ chainId: ParachainId.MOONBEAM })
  const markets = useMemo(() => positions.map(pos => pos.market), [positions])
  const { data: yields } = useYtInterestAndRewards(ParachainId.MOONBEAM, markets)
  const { data: rewards } = useMarketRewards(ParachainId.MOONBEAM, markets)

  const currentBalanceUSD = useMemo(() => {
    if (!tokenPrices)
      return 0

    return positions.reduce((total, pos) => {
      const syUSD = pos.syBalance?.multiply(tokenPrices[pos.syBalance.currency.wrapped.address] || 0).toFixed(6)
      const ptUSD = pos.ptBalance?.multiply(tokenPrices[pos.ptBalance.currency.wrapped.address] || 0).toFixed(6)
      const ytUSD = pos.ytBalance?.multiply(tokenPrices[pos.ytBalance.currency.wrapped.address] || 0).toFixed(6)
      const lpUSD = pos.lpBalance?.multiply(tokenPrices[pos.lpBalance.currency.wrapped.address] || 0).toFixed(6)

      return total + Number(syUSD || '0') + Number(ptUSD || '0') + Number(ytUSD || '0') + Number(lpUSD || '0')
    }, 0)
  }, [tokenPrices, positions])

  const claimableYieldAndRewards = useMemo(() => {
    if (!tokenPrices)
      return 0

    const yieldsUSD = (yields || []).reduce((total, ytYield) => {
      const interestUSD = ytYield.interest?.multiply(tokenPrices[ytYield.interest.currency.wrapped.address] || 0).toFixed(6)
      const rewardsUSD = ytYield.rewards.reduce((total, reward) => {
        const rewardUSD = reward.multiply(tokenPrices[reward.currency.wrapped.address] || 0).toFixed(6)
        return total + Number(rewardUSD)
      }, 0)

      return total + Number(interestUSD) + rewardsUSD
    }, 0)

    const rewardsUSD = (rewards || []).reduce((total, rewards) => {
      const rewardsUSD = rewards.reduce((total, reward) => {
        const rewardUSD = reward.multiply(tokenPrices[reward.currency.wrapped.address] || 0).toFixed(6)
        return total + Number(rewardUSD)
      }, 0)

      return total + rewardsUSD
    }, 0)

    return yieldsUSD + rewardsUSD
  }, [rewards, tokenPrices, yields])

  const {
    isWritePending: isClaimWritePending,
    sendTransaction: sendClaimTransaction,
  } = useRedeemRewardsReview({
    chainId: ParachainId.MOONBEAM,
    yts: useMemo(() => markets.map(market => market.YT), [markets]),
    markets,
  })

  const {
    isWritePending: isBoostWritePending,
    sendTransaction: sendBoostTransaction,
  } = useBoostMarketsReview({
    chainId: ParachainId.MOONBEAM,
    markets,
  })

  return (
    <div className="flex flex-col sm:flex-row mb-4 bg-slate-200 dark:bg-slate-800 rounded-xl divide-y sm:divide-x sm:divide-y-0 divide-dashed divide-slate-500/50">
      <div className="flex p-4 flex-grow justify-start sm:justify-center items-center">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <WalletIcon height={20} width={20} />
            <Typography weight={500}>
              <Trans>My Current Balance</Trans>
            </Typography>
          </div>
          <Typography variant="lg" weight={600}>
            {`$${formatTransactionAmount(Number(currentBalanceUSD.toFixed(2)))}`}
          </Typography>
        </div>
      </div>
      <div className="flex p-4 flex-grow justify-start sm:justify-center items-center">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <HandRaisedIcon height={20} width={20} />
            <Typography weight={500}>
              <Trans>My Claimable Yield & Rewards</Trans>
            </Typography>
          </div>
          <div className="flex gap-3 items-center">
            <Typography variant="lg" weight={600}>
              {`$${formatTransactionAmount(Number(claimableYieldAndRewards.toFixed(2)))}`}
            </Typography>
            <Button
              disabled={isClaimWritePending}
              onClick={() => sendClaimTransaction?.()}
              size="xs"
            >
              {isClaimWritePending
                ? <Dots><Trans>Confirm</Trans></Dots>
                : <Trans>Claim All</Trans>}
            </Button>
            <Button
              color="green"
              disabled={isBoostWritePending}
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
              onClick={() => sendBoostTransaction?.()}
              size="xs"
            >
              {isBoostWritePending
                ? <Dots><Trans>Confirm</Trans></Dots>
                : <Trans>Boost All</Trans>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
