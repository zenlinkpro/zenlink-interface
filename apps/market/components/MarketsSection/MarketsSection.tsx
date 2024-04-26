import type { FC } from 'react'
import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { classNames } from '@zenlink-interface/ui'
import { useIsMounted } from '@zenlink-interface/hooks'
import { Trans } from '@lingui/macro'
import { MarketsTable, TableFilters } from './Tables'

export const MarketsSection: FC = () => {
  const mounted = useIsMounted()
  const [tab, setTab] = useState<number>(0)

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
        </div>
        <TableFilters showAllFilters />
        <Tab.Panels>
          <Tab.Panel unmount={false}>
            <MarketsTable />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  )
}
