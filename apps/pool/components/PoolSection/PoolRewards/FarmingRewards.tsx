import { formatPercent } from '@zenlink-interface/format'
import type { Pool } from '@zenlink-interface/graph-client'
import { Currency, Table, Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { Trans, t } from '@lingui/macro'
import type { Incentive, PoolFarmWithIncentives } from 'lib/hooks'

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
          <Typography variant="sm" weight={400} className="text-slate-600 dark:text-slate-400">
            PID:{' '}
            <span className="text-slate-600 dark:text-slate-400">
              {' '}
              {farm.pid}
            </span>
          </Typography>
        </div>
        <div>
          <Typography variant="sm" weight={400} className="text-slate-600 dark:text-slate-400">
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
                    <Currency.Icon currency={incentive.token} width={24} height={24} />
                    <Typography weight={600} variant="sm" className="text-slate-900 dark:text-slate-50">
                      {incentive?.token?.symbol}
                    </Typography>
                  </div>
                </Table.td>
                <Table.td>
                  <Typography weight={500} variant="sm" className="text-slate-600 dark:text-slate-400">
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
