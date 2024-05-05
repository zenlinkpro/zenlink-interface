import { Tab } from '@headlessui/react'
import type { Market } from '@zenlink-interface/market'
import type { FC } from 'react'
import { classNames } from '@zenlink-interface/ui'
import { TAB_DEFAULT_CLASS, TAB_NOT_SELECTED_CLASS, TAB_SELECTED_CLASS } from 'components/MarketSection/constants'

interface MarketSwapProps {
  market: Market
}

export const MarketSwap: FC<MarketSwapProps> = ({ market }) => {
  return (
    <div className="w-full max-w-md px-2 py-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex w-2/5 space-x-1 rounded-full bg-blue-900/20 p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                TAB_DEFAULT_CLASS,
                selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
              )}
          >
            PT
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                TAB_DEFAULT_CLASS,
                selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
              )}
          >
            YT
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel>PT</Tab.Panel>
          <Tab.Panel>
            YT
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
