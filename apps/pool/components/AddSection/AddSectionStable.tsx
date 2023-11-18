import { Disclosure, Transition } from '@headlessui/react'
import { InformationCircleIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Checker, Web3Input, useStableSwapWithBase } from '@zenlink-interface/compat'
import type { Token } from '@zenlink-interface/currency'
import { Amount, tryParseAmount } from '@zenlink-interface/currency'
import type { StableSwap } from '@zenlink-interface/graph-client'
import { useIsMounted } from '@zenlink-interface/hooks'
import { ZERO } from '@zenlink-interface/math'
import { useCustomTokens } from '@zenlink-interface/shared'
import { Button, Dots, Skeleton, Tooltip, Typography, Widget, classNames } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useTokens } from 'lib/state/token-lists'
import { useAddStableSwapLiquidity, useTokensFromStableSwap } from 'lib/hooks'
import { Trans, t } from '@lingui/macro'
import { AddSectionReviewModalStable } from './AddSectionReviewModalStable'

export const AddSectionStable: FC<{ pool: StableSwap }> = ({ pool }) => {
  const isMounted = useIsMounted()
  const tokenMap = useTokens(pool.chainId)
  const [useBase] = useState(false)
  const { data } = useStableSwapWithBase(pool.chainId, tokenMap, pool.address)
  const tokens = useTokensFromStableSwap(data, useBase)
  const [inputAmountMap, setInputAmountMap] = useState<{ [address: string]: Amount<Token> }>({})
  const [inputMap, setInputMap] = useState<{ [address: string]: string }>({})
  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(pool.chainId)

  const handleInput = useCallback((token: Token, value: string) => {
    setInputMap(pre => ({
      ...pre,
      [token.address]: value,
    }))
    setInputAmountMap(pre => ({
      ...pre,
      [token.address]: tryParseAmount(value, token) ?? Amount.fromRawAmount(token, ZERO),
    }))
  }, [])

  const inputs = useMemo(
    () => tokens
      .map(token => inputAmountMap[token.address] ?? Amount.fromRawAmount(token, ZERO))
      .filter(amount => amount.greaterThan(ZERO)),
    [inputAmountMap, tokens],
  )
  const liquidity = useAddStableSwapLiquidity(data, inputs, useBase)

  return useMemo(
    () => (
      <AddSectionReviewModalStable
        chainId={pool.chainId}
        inputs={inputs}
        liquidity={liquidity}
        pool={pool}
        swap={data}
        useBase={useBase}
      >
        {({ isWritePending, setOpen }) => (
          <Widget id="addLiquidity" maxWidth={440}>
            <Widget.Content>
              <Disclosure defaultOpen={true}>
                {() => (
                  <>
                    <Widget.Header
                      className="!pb-3"
                      title={(
                        <div className="flex items-center gap-1">
                          <Trans>Add Liquidity</Trans>
                          <Tooltip
                            content={(
                              <Typography variant="xs" weight={500}>
                                <Trans>you can add liquidity using one asset or multiple assets</Trans>
                              </Typography>
                            )}
                          >
                            <InformationCircleIcon height={14} width={14} />
                          </Tooltip>
                        </div>
                      )}
                    />
                    <Transition
                      className="transition-[max-height] overflow-hidden"
                      enter="duration-300 ease-in-out"
                      enterFrom="transform max-h-0"
                      enterTo="transform max-h-[380px]"
                      leave="transition-[max-height] duration-250 ease-in-out"
                      leaveFrom="transform max-h-[380px]"
                      leaveTo="transform max-h-0"
                      unmount={false}
                    >
                      <Disclosure.Panel unmount={false}>
                        {!tokens.length && (
                          <div className="flex flex-col p-3 gap-6">
                            <Skeleton.Box className="w-full h-[68px] bg-black/[0.12] dark:bg-white/[0.06]" />
                            <Skeleton.Box className="w-full h-[68px] bg-black/[0.12] dark:bg-white/[0.06]" />
                            <Skeleton.Box className="w-full h-[68px] bg-black/[0.12] dark:bg-white/[0.06]" />
                            <Skeleton.Box className="w-full h-[68px] bg-black/[0.12] dark:bg-white/[0.06]" />
                          </div>
                        )}
                        {tokens.map((token, i) => (
                          <div key={token.address}>
                            <div className={classNames(i % 2 && 'bg-slate-200 dark:bg-slate-800')}>
                              <Web3Input.Currency
                                chainId={pool.chainId}
                                className="p-3"
                                currency={token}
                                customTokenMap={customTokensMap}
                                loading={false}
                                onAddToken={addCustomToken}
                                onChange={(value) => { handleInput(token, value) }}
                                onRemoveToken={removeCustomToken}
                                tokenMap={tokenMap}
                                value={inputMap[token.address] ?? ''}
                              />
                            </div>
                            {i < tokens.length - 1 && (
                              <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
                                <div className="group bg-slate-300 dark:bg-slate-700 p-0.5 border-2 border-slate-400 dark:border-slate-800 transition-all rounded-full hover:ring-2 hover:ring-slate-500 cursor-pointer">
                                  <PlusIcon height={16} width={16} />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        <div className={classNames('p-3', !(tokens.length % 2) && 'bg-slate-200 dark:bg-slate-800')}>
                          <Checker.Connected chainId={pool.chainId} fullWidth size="md">
                            <Checker.Custom
                              guard={(
                                <Button disabled={true} fullWidth size="md">
                                  <Trans>Pool Not Found</Trans>
                                </Button>
                              )}
                              showGuardIfTrue={isMounted && !tokens.length}
                            >
                              <Checker.Network chainId={pool.chainId} fullWidth size="md">
                                <Checker.Amounts
                                  amounts={inputs}
                                  chainId={pool.chainId}
                                  fullWidth
                                  size="md"
                                >
                                  <Button disabled={isWritePending} fullWidth onClick={() => setOpen(true)} size="md">
                                    {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : t`Add Liquidity`}
                                  </Button>
                                </Checker.Amounts>
                              </Checker.Network>
                            </Checker.Custom>
                          </Checker.Connected>
                        </div>
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            </Widget.Content>
          </Widget>
        )}
      </AddSectionReviewModalStable>
    ),
    [addCustomToken, customTokensMap, data, handleInput, inputMap, inputs, isMounted, liquidity, pool, removeCustomToken, tokenMap, tokens, useBase],
  )
}
