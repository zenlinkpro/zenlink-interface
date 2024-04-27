import { Tab } from '@headlessui/react'
import type { Market } from '@zenlink-interface/market'
import { Widget, classNames } from '@zenlink-interface/ui'
import { type FC, useState } from 'react'
import { Trans } from '@lingui/macro'

interface MarketActionsProps {
  market: Market
}

const TAB_DEFAULT_CLASS = 'hover:text-slate-900 hover:dark:text-slate-50 focus:text-slate-900 focus:dark:text-slate-50 font-medium !outline-none'
const TAB_SELECTED_CLASS = 'text-slate-800 dark:text-slate-200'
const TAB_NOT_SELECTED_CLASS = 'text-slate-500'

export const MarketActions: FC<MarketActionsProps> = ({ market }) => {
  const [tab, setTab] = useState(0)

  return (
    <Widget id="MarketActions" maxWidth={440}>
      <Widget.Content>
        <Tab.Group onChange={setTab} selectedIndex={tab}>
          <Widget.Header
            className="!pb-3"
            title={(
              <div className="flex items-center gap-6">
                <Tab className={({ selected }) =>
                  classNames(
                    selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
                    TAB_DEFAULT_CLASS,
                  )}
                >
                  <Trans>Swap</Trans>
                </Tab>
                <Tab className={({ selected }) =>
                  classNames(
                    selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
                    TAB_DEFAULT_CLASS,
                  )}
                >
                  <Trans>Mint</Trans>
                </Tab>
              </div>
            )}
          />
          <Tab.Panels>
            <Tab.Panel unmount={false}>
              Swap
            </Tab.Panel>
            <Tab.Panel unmount={false}>
              Mint
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Widget.Content>
    </Widget>
  )
}
