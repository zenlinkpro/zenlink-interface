import { Tab, TabGroup, TabPanel, TabPanels } from '@headlessui/react'
import { Trans } from '@lingui/macro'
import { Network, classNames } from '@zenlink-interface/ui'
import { PoolTable, TableFilters, ZLKStats, usePoolFilters } from 'components'
import { SUPPORTED_CHAIN_IDS } from 'config'
import type { FC } from 'react'

export const TableSection: FC = () => {
  const { selectedNetworks, setFilters } = usePoolFilters()

  return (
    <section>
      <TabGroup className="flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <Tab
            className={({ selected }) => classNames(
              selected ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500',
              'hover:text-slate-900 dark:hover:text-slate-50 focus:text-slate-900 dark:focus:text-slate-50 font-medium !outline-none',
            )}
          >
            <Trans>Top Pools</Trans>
          </Tab>
          <Tab
            className={({ selected }) => classNames(
              selected ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500',
              'hover:text-slate-900 dark:hover:text-slate-50 focus:text-slate-900 dark:focus:text-slate-50 font-medium !outline-none',
            )}
          >
            ZLK{' '}
            <Trans>Stats</Trans>
          </Tab>
        </div>
        <TabPanels>
          <TabPanel unmount={false}>
            <div className="flex flex-col gap-6">
              <TableFilters />
              <Network.Selector
                networks={SUPPORTED_CHAIN_IDS}
                onChange={selectedNetworks => setFilters({ selectedNetworks })}
                selectedNetworks={selectedNetworks}
              />
              <PoolTable />
            </div>
          </TabPanel>
          <TabPanel unmount>
            <ZLKStats />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </section>
  )
}
