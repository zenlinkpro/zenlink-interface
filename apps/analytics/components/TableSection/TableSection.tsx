import { Tab } from '@headlessui/react'
import { Network, classNames } from '@zenlink-interface/ui'
import { PoolTable, TableFilters, ZLKStats, usePoolFilters } from 'components'
import { SUPPORTED_CHAIN_IDS } from 'config'
import type { FC } from 'react'

export const TableSection: FC = () => {
  const { selectedNetworks, setFilters } = usePoolFilters()

  return (
    <section className="flex flex-col gap-6">
      <Tab.Group>
        <div className="flex items-center gap-6">
          <Tab
            className={({ selected }) =>
              classNames(
                selected ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500',
                'hover:text-slate-900 dark:hover:text-slate-50 focus:text-slate-900 dark:focus:text-slate-50 font-medium !outline-none',
              )
            }
          >
            Top Pools
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                selected ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500',
                'hover:text-slate-900 dark:hover:text-slate-50 focus:text-slate-900 dark:focus:text-slate-50 font-medium !outline-none',
              )
            }
          >
            ZLK Stats
          </Tab>
        </div>
        <Tab.Panels>
          <Tab.Panel unmount={false}>
            <div className="flex flex-col gap-6">
              <TableFilters />
              <Network.Selector
                networks={SUPPORTED_CHAIN_IDS}
                selectedNetworks={selectedNetworks}
                onChange={selectedNetworks => setFilters({ selectedNetworks })}
              />
              <PoolTable />
            </div>
          </Tab.Panel>
          <Tab.Panel unmount>
            <ZLKStats />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
