import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import chains from '@zenlink-interface/chain'
import { Amount, ZLK } from '@zenlink-interface/currency'
import { type Market, getMaturityFormatDate } from '@zenlink-interface/market'
import { JSBI } from '@zenlink-interface/math'
import { AppearOnMount, Currency, Link, NetworkIcon, Typography } from '@zenlink-interface/ui'
import { useRewardData } from '@zenlink-interface/wagmi'
import { type FC, useMemo } from 'react'

interface MarketHeaderProps {
  market: Market
}

export const MarketHeader: FC<MarketHeaderProps> = ({ market }) => {
  const { data: rewardData, isLoading } = useRewardData(market.chainId, market)

  const dailyPoolRewards = useMemo(() => {
    const zlkPerSec = rewardData?.zlkPerSec
    if (!zlkPerSec)
      return undefined

    return Amount.fromRawAmount(
      ZLK[market.chainId],
      JSBI.BigInt(JSBI.toNumber(zlkPerSec) * 3600 * 24),
    )
  }, [market.chainId, rewardData?.zlkPerSec])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex gap-1 items-center">
          <NetworkIcon chainId={market.chainId} height={16} type="naked" width={16} />
          <Typography className="text-slate-500" variant="xs">
            {chains[market.chainId].name}
          </Typography>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex">
            <div className="mr-[26px]">
              <Currency.Icon currency={market.SY.yieldToken} height={44} width={44} />
            </div>
            <Link.External
              className="flex flex-col !no-underline group"
              href={chains[market.chainId].getTokenUrl(market.SY.yieldToken.address)}
            >
              <div className="flex items-center gap-2">
                <Typography
                  className="flex items-center gap-1 text-slate-900 dark:text-slate-50 group-hover:text-blue-400"
                  variant="lg"
                  weight={600}
                >
                  {market.SY.yieldToken.symbol}
                  <ArrowTopRightOnSquareIcon className="text-slate-600 dark:text-slate-400 group-hover:text-blue-400" height={20} width={20} />
                </Typography>
              </div>
              <Typography className="text-slate-700 dark:text-slate-300" variant="xs">
                <Trans>
                  Maturity: {getMaturityFormatDate(market)}
                </Trans>
              </Typography>
            </Link.External>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="text-slate-700 dark:text-slate-300 flex justify-between p-3 rounded-lg shadow-sm border border-slate-500/20 bg-white dark:bg-slate-800 shdow-white/10 dark:shadow-black/10">
          <Typography variant="sm" weight={600}>
            <Trans>Est. Daily Pool Rewards</Trans>
          </Typography>
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
