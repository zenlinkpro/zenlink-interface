import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { PlusIcon } from '@heroicons/react/24/solid'
import type { ParachainId } from '@zenlink-interface/chain'
import { Web3Input } from '@zenlink-interface/compat'
import type { Type } from '@zenlink-interface/currency'
import { useIsMounted } from '@zenlink-interface/hooks'
import { useCustomTokens } from '@zenlink-interface/shared'
import { Widget, classNames } from '@zenlink-interface/ui'
import type { FC, ReactNode } from 'react'

import { useTokens } from '../../lib/state/token-lists'
import { SettingsOverlay } from '../SettingsOverlay'

interface AddSectionWidgetProps {
  isFarm: boolean
  chainId: ParachainId
  input0: string
  input1: string
  token0: Type | undefined
  token1: Type | undefined
  onSelectToken0?(currency: Type): void
  onSelectToken1?(currency: Type): void
  onInput0(value: string): void
  onInput1(value: string): void
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
                <Widget.Header title="1. Add Liquidity" className="!pb-3 ">
                  <div className="flex gap-3">
                    <SettingsOverlay chainId={chainId} variant="dialog" />
                    <Disclosure.Button className="w-full pr-0.5">
                      <div className="flex items-center justify-between">
                        <div
                          className={classNames(
                            open ? 'rotate-180' : 'rotate-0',
                            'transition-all w-5 h-5 -mr-1.5 flex items-center delay-300',
                          )}
                        >
                          <ChevronDownIcon
                            width={24}
                            height={24}
                            className="group-hover:text-slate-200 text-slate-300"
                          />
                        </div>
                      </div>
                    </Disclosure.Button>
                  </div>
                </Widget.Header>
                  )
                : (
                <Widget.Header title="Add Liquidity" className="!pb-3" />
                  )}
              <Transition
                unmount={false}
                className="transition-[max-height] overflow-hidden"
                enter="duration-300 ease-in-out"
                enterFrom="transform max-h-0"
                enterTo="transform max-h-[380px]"
                leave="transition-[max-height] duration-250 ease-in-out"
                leaveFrom="transform max-h-[380px]"
                leaveTo="transform max-h-0"
              >
                <Disclosure.Panel unmount={false}>
                  <Web3Input.Currency
                    className="p-3"
                    loading={false}
                    value={input0}
                    onChange={onInput0}
                    onSelect={onSelectToken0}
                    currency={token0}
                    customTokenMap={customTokensMap}
                    onAddToken={addCustomToken}
                    onRemoveToken={removeCustomToken}
                    chainId={chainId}
                    tokenMap={tokenMap}
                  />
                  <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
                    <div className="group bg-slate-300 dark:bg-slate-700 p-0.5 border-2 border-slate-400 dark:border-slate-800 transition-all rounded-full hover:ring-2 hover:ring-slate-500 cursor-pointer">
                      <PlusIcon width={16} height={16} />
                    </div>
                  </div>
                  <div className="bg-slate-200 dark:bg-slate-800">
                    <Web3Input.Currency
                      className="p-3 !pb-1"
                      value={input1}
                      onChange={onInput1}
                      currency={token1}
                      onSelect={onSelectToken1}
                      customTokenMap={customTokensMap}
                      onAddToken={addCustomToken}
                      onRemoveToken={removeCustomToken}
                      chainId={chainId}
                      tokenMap={tokenMap}
                    />
                    <div className="p-3">{children}</div>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </Widget.Content>
    </Widget>
  )
}
