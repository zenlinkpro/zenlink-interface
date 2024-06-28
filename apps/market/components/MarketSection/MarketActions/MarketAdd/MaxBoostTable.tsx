import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { ParachainId } from '@zenlink-interface/chain'
import type { Token } from '@zenlink-interface/currency'
import { Amount, ZLK } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import { ZERO } from '@zenlink-interface/math'
import { Tooltip, Typography } from '@zenlink-interface/ui'
import { useVotingEscrow } from '@zenlink-interface/wagmi'
import { type FC, useMemo } from 'react'

interface MaxBoostTableProps {
  market: Market
  lpMinted: Amount<Token>
  className?: string
}

export const MaxBoostTable: FC<MaxBoostTableProps> = ({ market, lpMinted, className }) => {
  const { data } = useVotingEscrow(ParachainId.MOONBEAM)

  const [maxBoostAmount3Months, maxBoostAmount1Year, maxBoostAmount2Years] = useMemo(
    () => {
      const maxBoostAmount = market.calcMaxBoostZLkAmount(
        lpMinted,
        data?.totalSupplyAmount || ZERO,
      )

      return [
        Amount.fromRawAmount(ZLK[ParachainId.MOONBEAM], maxBoostAmount[0]),
        Amount.fromRawAmount(ZLK[ParachainId.MOONBEAM], maxBoostAmount[1]),
        Amount.fromRawAmount(ZLK[ParachainId.MOONBEAM], maxBoostAmount[2]),
      ]
    },
    [data?.totalSupplyAmount, lpMinted, market],
  )

  return (
    <div className="flex flex-col gap-2 mt-3">
      <div className="flex items-center gap-2 px-2">
        <Typography variant="sm" weight={600}>
          LP Reward Boost
        </Typography>
        <Tooltip
          content={(
            <div className="flex flex-col w-80">
              <Typography className="text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
                <Trans>
                  If you LP in a pool while you are holding veZLK,
                  your ZLK incentives and rewards for all of your LPs will be further boosted as well,
                  by up to 250% based on your veZLK value. To obtain the maximum boost,
                  you have to own an equivalent % supply of veZLK as your ownership % of LP in the pool.
                </Trans>
              </Typography>
            </div>
          )}
        >
          <InformationCircleIcon height={14} width={14} />
        </Tooltip>
      </div>
      <table className="border-separate border-spacing-0 border-[1.5px] border-blue rounded-xl overflow-hidden w-full">
        <thead>
          <tr>
            <th className="p-2 border border-slate-300 dark:border-slate-600 border-t-0 border-l-0 text-left">
              <Typography variant="xs" weight={600}>ZLK Lock Time</Typography>
            </th>
            <th className="border border-slate-300 dark:border-slate-600 border-t-0 text-center">
              <Typography variant="xs" weight={600}>3M</Typography>
            </th>
            <th className="border border-slate-300 dark:border-slate-600 border-t-0 text-center">
              <Typography variant="xs" weight={600}>1Y</Typography>
            </th>
            <th className="border border-slate-300 dark:border-slate-600 border-t-0 border-r-0 text-center">
              <Typography variant="xs" weight={600}>2Y</Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="gap-1 p-2 border border-slate-300 dark:border-slate-600 text-left border-b-0 border-l-0">
              <Typography variant="xs" weight={600}>
                ZLK for <span className="text-blue">MAX BOOST</span>
              </Typography>
            </td>
            <td className="p-2 border border-slate-300 dark:border-slate-600 border-b-0 text-blue text-center">
              <Typography variant="xs" weight={600}>
                {maxBoostAmount3Months.toSignificant(1)}
              </Typography>
            </td>
            <td className="p-2 border border-slate-300 dark:border-slate-600 border-b-0 text-blue text-center">
              <Typography variant="xs" weight={600}>
                {maxBoostAmount1Year.toSignificant(1)}
              </Typography>
            </td>
            <td className="p-2 border border-slate-300 dark:border-slate-600 border-b-0 border-r-0 text-blue text-center">
              <Typography variant="xs" weight={600}>
                {maxBoostAmount2Years.toSignificant(1)}
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
