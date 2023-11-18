import { PlusIcon } from '@heroicons/react/24/solid'
import type { StableSwap as GraphStableSwap } from '@zenlink-interface/graph-client'
import type { ParachainId } from '@zenlink-interface/chain'
import type { CalculatedStbaleSwapLiquidity, StableSwapWithBase } from '@zenlink-interface/wagmi'
import type { FC, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Button, Currency, Dialog, Dots, Typography } from '@zenlink-interface/ui'
import type { Amount, Token } from '@zenlink-interface/currency'
import { useNotifications } from '@zenlink-interface/shared'
import { Approve, useAccount, useAddLiquidityStableReview } from '@zenlink-interface/compat'
import { useTokenAmountDollarValues } from 'lib/hooks'
import { Trans, t } from '@lingui/macro'

interface AddSectionReviewModalStableProps {
  swap: StableSwapWithBase | undefined
  pool: GraphStableSwap | undefined
  inputs: Amount<Token>[]
  chainId: ParachainId
  useBase: boolean
  liquidity: CalculatedStbaleSwapLiquidity
  children({ isWritePending, setOpen }: { isWritePending: boolean, setOpen(open: boolean): void }): ReactNode
}

export const AddSectionReviewModalStable: FC<AddSectionReviewModalStableProps> = ({
  chainId,
  swap,
  useBase,
  liquidity,
  inputs,
  pool,
  children,
}) => {
  const [open, setOpen] = useState(false)
  const { address } = useAccount()

  const [, { createNotification }] = useNotifications(address)

  const values = useTokenAmountDollarValues({ chainId, amounts: inputs })

  const { sendTransaction, isWritePending, routerAddress } = useAddLiquidityStableReview({
    chainId,
    swap,
    poolName: pool?.name,
    inputs,
    useBase,
    liquidity,
    setOpen,
  })

  return useMemo(
    () => (
      <>
        {children({ isWritePending, setOpen })}
        <Dialog onClose={() => setOpen(false)} open={open}>
          <Dialog.Content className="max-w-sm !pb-4">
            <Dialog.Header border={false} onClose={() => setOpen(false)} title={t`Add Liquidity`} />
            <div className="!my-0 grid grid-cols-1 items-center">
              {inputs.map((input, i) => (
                <div key={input.currency.address}>
                  <div className="flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-300/40  dark:bg-slate-700/40 border-slate-500/20 dark:border-slate-200/5">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-between w-full gap-2">
                        <Typography className="truncate text-slate-900 dark:text-slate-50" variant="h3" weight={500}>
                          {input?.toSignificant(6)}{' '}
                        </Typography>
                        <div className="flex items-center justify-end gap-2 text-right">
                          {input && (
                            <div className="w-5 h-5">
                              <Currency.Icon currency={input.currency} height={20} width={20} />
                            </div>
                          )}
                          <Typography className="text-right text-slate-900 dark:text-slate-50" variant="h3" weight={500}>
                            {input?.currency.symbol}
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <Typography className="text-slate-500" variant="sm" weight={500}>
                      {values[i] ? `$${values[i].toFixed(2)}` : '-'}
                    </Typography>
                  </div>
                  {i < inputs.length - 1 && (
                    <div className="flex items-center justify-center col-span-12 -mt-2.5 -mb-2.5">
                      <div className="p-0.5 bg-slate-300 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-800 ring-1 ring-slate-500/20 dark:ring-slate-200/5 z-10 rounded-full">
                        <PlusIcon className="text-slate-800 dark:text-slate-200" height={18} width={18} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center p-4">
              <Typography
                as="button"
                className="flex items-center gap-1 text-slate-900 dark:text-slate-100"
                variant="sm"
                weight={600}
              >
                You&apos;ll receive: {liquidity.amount && pool && <span className="font-normal text-slate-700 dark:text-slate-300">{liquidity.amount.toSignificant(6)} {pool.name} lp</span>}
              </Typography>
            </div>
            <Approve
              chainId={chainId}
              className="flex-grow !justify-end"
              components={(
                <Approve.Components>
                  {inputs.map(input => (
                    <Approve.Token
                      address={routerAddress}
                      amount={input}
                      chainId={chainId}
                      className="whitespace-nowrap"
                      fullWidth
                      key={input.currency.address}
                      size="md"
                    />
                  ))}
                </Approve.Components>
              )}
              onSuccess={createNotification}
              render={({ approved }) => {
                return (
                  <Button disabled={!approved || isWritePending} fullWidth onClick={() => sendTransaction?.()} size="md">
                    {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : 'Add'}
                  </Button>
                )
              }}
            />
          </Dialog.Content>
        </Dialog>
      </>
    ),
    [chainId, children, createNotification, inputs, isWritePending, liquidity.amount, open, pool, routerAddress, sendTransaction, values],
  )
}
