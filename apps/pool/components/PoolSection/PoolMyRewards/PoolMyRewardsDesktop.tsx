import { formatUSD } from '@zenlink-interface/format'
import type { Pool } from '@zenlink-interface/graph-client'
import { Button, Currency, Dots, Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useMemo } from 'react'
import { Checker, useBlockNumber, useClaimFarmingRewardsReview } from '@zenlink-interface/compat'
import { Trans, t } from '@lingui/macro'
import { ZERO } from '@zenlink-interface/math'
import type { PoolFarmWithIncentives } from 'lib/hooks'
import { useTokenAmountDollarValues } from 'lib/hooks'
import { usePoolPositionRewards } from 'components/PoolPositionRewardsProvider'

interface PoolMyRewardsProps {
  averageBlockTime?: number
  pool: Pool
  pid: number
  farm: PoolFarmWithIncentives
}

export const PoolMyRewardsDesktop: FC<PoolMyRewardsProps> = ({
  averageBlockTime = 12000,
  pool,
  farm,
}) => {
  const { isError, isLoading, farmRewardsMap } = usePoolPositionRewards()

  const pid = farm?.pid
  const farmRewardsInfo = farmRewardsMap?.[pid]
  const blockNumber = useBlockNumber(pool.chainId)
  const nextClaimableBlock = useMemo(
    () => farmRewardsInfo?.nextClaimableBlock ?? 0,
    [farmRewardsInfo?.nextClaimableBlock],
  )
  const pendingRewards = useMemo(
    () => farmRewardsInfo.pendingRewards,
    [farmRewardsInfo.pendingRewards],
  )
  const values = useTokenAmountDollarValues({
    chainId: pool.chainId,
    amounts: pendingRewards,
  })

  const chainId = pool.chainId

  const { sendTransaction, isWritePending } = useClaimFarmingRewardsReview({
    chainId,
    pid,
  })

  const remainTime = useMemo(() => {
    if (!blockNumber || !nextClaimableBlock)
      return 0
    return (nextClaimableBlock - blockNumber) * averageBlockTime
  }, [averageBlockTime, blockNumber, nextClaimableBlock])

  const formatCountDown = useMemo(() => {
    if (remainTime < 60_000)
      return t`Next: <1m`

    const endSeconds = Number(remainTime.toFixed(0))

    const day = Math.floor((endSeconds / 1000 / 3600) / 24)
    const hour = Math.floor((endSeconds / 1000 / 3600) % 24)
    const minute = Math.floor((endSeconds / 1000 / 60) % 60)
    return `${t`Next`}: ${day}d ${hour}h ${minute}m`
  }, [remainTime])

  const actionActive = useMemo(
    () => blockNumber
      ? blockNumber > nextClaimableBlock && pendingRewards.some(reward => reward?.greaterThan(ZERO))
      : false,
    [blockNumber, nextClaimableBlock, pendingRewards],
  )

  if (isLoading && !isError) {
    return (
      <div className="flex flex-col gap-3">
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
      <div className="flex flex-col gap-3">
        <div className="text-sm leading-5 font-normal px-2 text-slate-600 dark:text-slate-400">
          PID: {pid}
        </div>
        {pendingRewards
          .filter(incentive => Boolean(incentive))
          .map((incentive, index) => (
            <div className="flex items-center justify-between" key={incentive.currency.address}>
              <div className="flex items-center gap-2">
                <Currency.Icon currency={incentive.currency} height={20} width={20} />
                <Typography className="text-slate-700 dark:text-slate-300" variant="sm" weight={600}>
                  {incentive.toSignificant(6)} {incentive.currency.symbol}
                </Typography>
              </div>
              <Typography className="text-slate-600 dark:text-slate-400" variant="xs" weight={500}>
                {formatUSD(values[index] ?? '0')}
              </Typography>
            </div>
          ))}
        <div>
          <Checker.Connected chainId={chainId} fullWidth size="md">
            <Checker.Network chainId={chainId} fullWidth size="md">
              <Checker.Custom
                guard={(
                  <Button disabled={true} fullWidth size="md">
                    {actionActive ? <Trans>Claim</Trans> : formatCountDown}
                  </Button>
                )}
                showGuardIfTrue={!actionActive}
              >
                <Button
                  disabled={isWritePending}
                  fullWidth
                  onClick={() => sendTransaction?.()}
                  size="md"
                  variant="filled"
                >
                  {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : 'Claim'}
                </Button>
              </Checker.Custom>
            </Checker.Network>
          </Checker.Connected>
        </div>
      </div>
    )
  }

  return <></>
}
