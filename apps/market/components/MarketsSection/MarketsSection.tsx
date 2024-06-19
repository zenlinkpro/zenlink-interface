import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { Tab } from '@headlessui/react'
import { Chip, classNames } from '@zenlink-interface/ui'
import { useIsMounted } from '@zenlink-interface/hooks'
import { Trans } from '@lingui/macro'
import { useAccount } from '@zenlink-interface/compat'
import { useMarketPositions, useMarkets } from '@zenlink-interface/wagmi'
import { ParachainId } from '@zenlink-interface/chain'
import { MarketsTable, PositionsTable, TableFilters } from './Tables'
import { PositionDashboard } from './PositionDashboard'

export const MarketsSection: FC = () => {
  const { address } = useAccount()
  const mounted = useIsMounted()
  const [tab, setTab] = useState<number>(0)

  const { data: markets, isLoading: isMarketsLoading } = useMarkets(ParachainId.MOONBEAM)
  const { data: positions, isLoading: isMarketPositionsLoading } = useMarketPositions(ParachainId.MOONBEAM, markets || [])

  const validPositions = useMemo(() => {
    if (!positions)
      return []

    return positions.filter(
      position =>
        position.ptBalance?.greaterThan(0)
        || position.ytBalance?.greaterThan(0)
        || position.lpBalance?.greaterThan(0),
    )
  }, [positions])

  return (
    <section className="flex flex-col">
      <Tab.Group onChange={setTab} selectedIndex={tab}>
        <div className="flex items-center gap-6 mb-6">
          <Tab className={({ selected }) => classNames(
            selected ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500',
            'hover:text-slate-900 hover:dark:text-slate-50 focus:text-slate-900 focus:dark:text-slate-50 font-medium !outline-none',
          )}
          >
            <Trans>All Markets</Trans>
          </Tab>
          {address && mounted && (
            <Tab
              className={({ selected }) => classNames(
                selected ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500',
                'hover:text-slate-900 hover:dark:text-slate-50 focus:text-slate-900 focus:dark:text-slate-50 font-medium !outline-none',
              )}
            >
              <Trans>My Positions</Trans> <Chip color="blue" label={validPositions?.length || '0'} size="sm" />
            </Tab>
          )}
        </div>
        <Tab.Panels>
          <Tab.Panel unmount={false}>
            <TableFilters showAllFilters />
            <MarketsTable isLoading={isMarketsLoading} markets={markets} />
          </Tab.Panel>
          <Tab.Panel unmount={!address || !mounted}>
            <PositionDashboard positions={validPositions} />
            <TableFilters showAllFilters />
            <PositionsTable isLoading={isMarketPositionsLoading} positions={validPositions} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
