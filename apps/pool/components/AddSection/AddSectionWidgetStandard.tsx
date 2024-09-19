import type { ParachainId } from '@zenlink-interface/chain'
import type { Type } from '@zenlink-interface/currency'
import type { FC, ReactNode } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { PlusIcon } from '@heroicons/react/24/solid'
import { t } from '@lingui/macro'
import { Web3Input } from '@zenlink-interface/compat'
import { useIsMounted } from '@zenlink-interface/hooks'
import { useCustomTokens } from '@zenlink-interface/shared'

import { classNames, Widget } from '@zenlink-interface/ui'
import { useTokens } from '../../lib/state/token-lists'
import { SettingsOverlay } from '../SettingsOverlay'

interface AddSectionWidgetProps {
  isFarm: boolean
  chainId: ParachainId
  input0: string
  input1: string
  token0: Type | undefined
  token1: Type | undefined
  onSelectToken0?: (currency: Type) => void
  onSelectToken1?: (currency: Type) => void
  onInput0: (value: string) => void
  onInput1: (value: string) => void
  children: ReactNode
}

export const AddSectionWidgetStandard: FC<AddSectionWidgetProps> = ({
  isFarm,
  chainId,
  input0,
  input1,
  token0,
  token1,
  onSelectToken0,
  onSelectToken1,
  onInput0,
  onInput1,
  children,
}) => {
  const isMounted = useIsMounted()
  const tokenMap = useTokens(chainId)
  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)

  return (
    <Widget id="addLiquidity" maxWidth={440}>
      <Widget.Content>
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              {isFarm && isMounted
                ? (
                    <Widget.Header className="!pb-3 " title="1. Add Liquidity">
                      <div className="flex gap-3">
                        <SettingsOverlay chainId={chainId} variant="dialog" />
                        <DisclosureButton className="w-full pr-0.5">
                          <div className="flex items-center justify-between">
                            <div
                              className={classNames(
                                open ? 'rotate-180' : 'rotate-0',
                                'transition-all w-5 h-5 -mr-1.5 flex items-center delay-300',
                              )}
                            >
                              <ChevronDownIcon
                                className="group-hover:text-slate-200 text-slate-300"
                                height={24}
                                width={24}
                              />
                            </div>
                          </div>
                        </DisclosureButton>
                      </div>
                    </Widget.Header>
                  )
                : (
                    <Widget.Header className="!pb-3" title={t`Add Liquidity`} />
                  )}
              <Transition
                as="div"
                className="transition-[max-height] overflow-hidden"
                enter="duration-300 ease-in-out"
                enterFrom="transform max-h-0"
                enterTo="transform max-h-[380px]"
                leave="transition-[max-height] duration-250 ease-in-out"
                leaveFrom="transform max-h-[380px]"
                leaveTo="transform max-h-0"
                unmount={false}
              >
                <DisclosurePanel unmount={false}>
                  <Web3Input.Currency
                    chainId={chainId}
                    className="p-3"
                    currency={token0}
                    customTokenMap={customTokensMap}
                    loading={false}
                    onAddToken={addCustomToken}
                    onChange={onInput0}
                    onRemoveToken={removeCustomToken}
                    onSelect={onSelectToken0}
                    tokenMap={tokenMap}
                    value={input0}
                  />
                  <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
                    <div className="group bg-slate-300 dark:bg-slate-700 p-0.5 border-2 border-slate-400 dark:border-slate-800 transition-all rounded-full hover:ring-2 hover:ring-slate-500 cursor-pointer">
                      <PlusIcon height={16} width={16} />
                    </div>
                  </div>
                  <div className="bg-slate-200 dark:bg-slate-800">
                    <Web3Input.Currency
                      chainId={chainId}
                      className="p-3 !pb-1"
                      currency={token1}
                      customTokenMap={customTokensMap}
                      onAddToken={addCustomToken}
                      onChange={onInput1}
                      onRemoveToken={removeCustomToken}
                      onSelect={onSelectToken1}
                      tokenMap={tokenMap}
                      value={input1}
                    />
                    <div className="p-3">{children}</div>
                  </div>
                </DisclosurePanel>
              </Transition>
            </>
          )}
        </Disclosure>
      </Widget.Content>
    </Widget>
  )
}
