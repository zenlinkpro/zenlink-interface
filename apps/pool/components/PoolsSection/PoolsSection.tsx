import type { FC } from 'react'
import { useState } from 'react'
import useSWR from 'swr'
import type { LiquidityPosition, POOL_TYPE } from '@zenlink-interface/graph-client'
import { Tab } from '@headlessui/react'
import { Chip, classNames } from '@zenlink-interface/ui'
import { useAccount } from '@zenlink-interface/compat'
import { PositionsTable, TableFilters } from './Tables'

export const PoolsSection: FC = () => {
  const { address } = useAccount()
  const [tab, setTab] = useState<number>(0)
  const { data: userPools } = useSWR<LiquidityPosition<POOL_TYPE>[]>(
    address ? [`/pool/api/user/${address}`] : null,
    url => fetch(url).then(response => response.json()),
  )

  return (
    <section className="flex flex-col">
      <Tab.Group selectedIndex={tab} onChange={setTab}>
        <div className="flex items-center gap-6 mb-6">
          {address && (
            <Tab
              className={({ selected }) =>
                classNames(
                  selected ? 'text-slate-200' : 'text-slate-500',
                  'hover:text-slate-50 focus:text-slate-50 flex items-center gap-2 font-medium !outline-none',
                )
              }
            >
              My Positions <Chip label={userPools?.length || '0'} size="sm" color="blue" />
            </Tab>
          )}
        </div>
        <TableFilters showAllFilters={tab === 0} />
        <Tab.Panels>
          <Tab.Panel unmount={!address}>
            <PositionsTable />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
