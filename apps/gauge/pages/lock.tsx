import { ParachainId } from '@zenlink-interface/chain'
import { CurrencyInput } from '@zenlink-interface/compat'
import { type BreadcrumbLink, Widget, classNames } from '@zenlink-interface/ui'
import { Layout } from 'components'
import { useCallback, useState } from 'react'
import { SWRConfig } from 'swr'
import { ZLK } from '@zenlink-interface/currency'
import { Tab } from '@headlessui/react'
import { Trans } from '@lingui/macro'

const LINKS: BreadcrumbLink[] = [
  {
    href: '/lock',
    label: 'Lock',
  },
]

export const TAB_DEFAULT_CLASS = 'w-full rounded-full py-1 text-sm font-medium leading-5 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
export const TAB_SELECTED_CLASS = 'bg-white text-slate-700 shadow'
export const TAB_NOT_SELECTED_CLASS = 'text-blue-100 hover:bg-white/[0.12] hover:text-white'

function Lock() {
  return (
    <SWRConfig>
      <Layout breadcrumbs={LINKS}>
        <Widget className="!bg-transparent border-transparent" id="Lock" maxWidth={440}>
          <Widget.Content>
            <Tab.Group>
              <div className="flex max-w-sm justify-center mb-4 mx-auto">
                <Tab.List className="flex w-3/5 space-x-1 rounded-full bg-blue-900/20 p-1">
                  <Tab className={({ selected }) =>
                    classNames(
                      selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
                      TAB_DEFAULT_CLASS,
                    )}
                  >
                    <Trans>Lock</Trans>
                  </Tab>
                  <Tab className={({ selected }) =>
                    classNames(
                      selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
                      TAB_DEFAULT_CLASS,
                    )}
                  >
                    <Trans>Redeem</Trans>
                  </Tab>
                </Tab.List>
              </div>
              <Tab.Panels>
                <Tab.Panel unmount={false}>
                  <LockPanel />
                </Tab.Panel>
                <Tab.Panel unmount={false}>
                  Redeem
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </Widget.Content>
        </Widget>
      </Layout>
    </SWRConfig>
  )
}

function LockPanel() {
  const [input, setInput] = useState('')
  const ZLKOnMoonbeam = ZLK[ParachainId.MOONBEAM]

  const onInput = useCallback((val: string) => {
    setInput(val)
  }, [])

  return (
    <CurrencyInput
      chainId={ParachainId.MOONBEAM}
      className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-2xl"
      currency={ZLKOnMoonbeam}
      loading={!ZLKOnMoonbeam}
      onChange={onInput}
      value={input}
    />
  )
}

export default Lock
