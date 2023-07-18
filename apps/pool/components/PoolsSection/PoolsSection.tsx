import type { FC } from 'react'
import { useState } from 'react'
import useSWR from 'swr'
import type { LiquidityPosition, POOL_TYPE } from '@zenlink-interface/graph-client'
import { Tab } from '@headlessui/react'
import { Chip, classNames } from '@zenlink-interface/ui'
import { useAccount } from '@zenlink-interface/compat'
import { useIsMounted } from '@zenlink-interface/hooks'
import { Trans } from '@lingui/macro'
import { PoolsTable, PositionsTable, TableFilters } from './Tables'

export const PoolsSection: FC = () => {
  const { address } = useAccount()
  const mounted = useIsMounted()
  const [tab, setTab] = useState<number>(0)
  const { data: userPools } = useSWR<LiquidityPosition<POOL_TYPE>[]>(
    address ? [`/pool/api/user/${address}`] : null,
    (url: string) => fetch(url).then(response => response.json()),
    {
      revalidateOnMount: true,
    },
  )

  return (
    <section className="flex flex-col">
      <Tab.Group selectedIndex={tab} onChange={setTab}>
        <div className="flex items-center gap-6 mb-6">
          <Tab
            className={({ selected }) =>
              classNames(
                selected ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500',
                'hover:text-slate-900 hover:dark:text-slate-50 focus:text-slate-900 focus:dark:text-slate-50 font-medium !outline-none',
              )
            }
          >
            <Trans>All Pools</Trans>
          </Tab>
          {address && mounted && (
            <Tab
              className={({ selected }) =>
                classNames(
                  selected ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500',
                  'hover:text-slate-900 hover:dark:text-slate-50 focus:text-slate-900 focus:dark:text-slate-50 font-medium !outline-none',
                )
              }
            >
              <Trans>My Positions</Trans> <Chip label={userPools?.length || '0'} size="sm" color="blue" />
            </Tab>
          )}
        </div>
        <TableFilters showAllFilters />
        <Tab.Panels>
          <Tab.Panel unmount={false}>
            <PoolsTable />
          </Tab.Panel>
          <Tab.Panel unmount={!address || !mounted}>
            <PositionsTable />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
