import type { Pool } from '@zenlink-interface/graph-client'
import type { Incentive, PoolFarmWithIncentives } from 'lib/hooks'
import type { FC } from 'react'
import { t, Trans } from '@lingui/macro'
import { formatPercent } from '@zenlink-interface/format'
import { Currency, Table, Typography } from '@zenlink-interface/ui'

interface FarmingRewardsProps {
  incentives: Incentive[]
  farm: PoolFarmWithIncentives
  pool: Pool
}

export const FarmingRewards: FC<FarmingRewardsProps> = ({ incentives, farm }) => {
  return (
    <div className="flex flex-col w-full gap-1">
      <div className="flex justify-between mx-4">
        <div className="">
          <Typography className="text-slate-600 dark:text-slate-400" variant="sm" weight={400}>
            PID:{' '}
            <span className="text-slate-600 dark:text-slate-400">
              {' '}
              {farm.pid}
            </span>
          </Typography>
        </div>
        <div>
          <Typography className="text-slate-600 dark:text-slate-400" variant="sm" weight={400}>
            <Trans>Reward APR</Trans>
            :{' '}
            <span className="text-slate-600 dark:text-slate-400">
              {' '}
              {formatPercent(Number(farm.stakeApr))}
            </span>
          </Typography>
        </div>
      </div>
      <Table.container className="w-full">
        <Table.table>
          <Table.thead>
            <Table.thr>
              <Table.th>
                <div className="text-left">
                  <Trans>Token</Trans>
                </div>
              </Table.th>
              <Table.th>
                <div className="text-left">
                  <Trans>Amount</Trans>
                </div>
              </Table.th>
            </Table.thr>
          </Table.thead>
          <Table.tbody>
            {incentives.map(incentive => (
              <Table.tr key={incentive?.token?.symbol}>
                <Table.td>
                  <div className="flex items-center gap-3">
                    <Currency.Icon currency={incentive.token} height={24} width={24} />
                    <Typography className="text-slate-900 dark:text-slate-50" variant="sm" weight={600}>
                      {incentive?.token?.symbol}
                    </Typography>
                  </div>
                </Table.td>
                <Table.td>
                  <Typography className="text-slate-600 dark:text-slate-400" variant="sm" weight={500}>
                    {t`${Number(Number(incentive?.rewardPerDay).toPrecision(6))} ${incentive?.token?.symbol} per day`}
                  </Typography>
                </Table.td>
              </Table.tr>
            ))}
          </Table.tbody>
        </Table.table>
      </Table.container>
    </div>
  )
}
