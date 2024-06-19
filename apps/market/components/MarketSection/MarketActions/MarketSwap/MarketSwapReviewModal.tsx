import { type FC, type ReactNode, useMemo, useState } from 'react'
import { Approve, useAccount } from '@zenlink-interface/compat'
import { useNotifications } from '@zenlink-interface/shared'
import { useMarketSwapReview } from '@zenlink-interface/wagmi'
import type { Market } from '@zenlink-interface/market'
import { Button, Dialog, Dots, Typography } from '@zenlink-interface/ui'
import { Trans } from '@lingui/macro'
import { Icon } from '@zenlink-interface/ui/currency/Icon'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useTokenAmountDollarValues } from 'lib/hooks'
import { useTrade } from './TradeProvider'

interface MarketSwapReviewModalProps {
  chainId: number
  market: Market
  children: ({ isWritePending, setOpen }: { isWritePending: boolean, setOpen: (open: boolean) => void }) => ReactNode
  onSuccess: () => void
}

export const MarketSwapReviewModal: FC<MarketSwapReviewModalProps> = ({
  chainId,
  market,
  children,
  onSuccess,
}) => {
  const { trade } = useTrade()
  const { address: account } = useAccount()
  const [, { createNotification }] = useNotifications(account)
  const [open, setOpen] = useState(false)

  const [input0, input1] = useMemo(
    () => [trade?.inputAmount, trade?.outputAmount],
    [trade?.inputAmount, trade?.outputAmount],
  )
  const [value0, value1] = useTokenAmountDollarValues({ amounts: [input0, input1], chainId })

  const { isWritePending, sendTransaction, routerAddress } = useMarketSwapReview({
    chainId,
    onSuccess,
    setOpen,
    market,
    trade,
  })

  return (
    <>
      {children({ isWritePending, setOpen })}
      <Dialog onClose={() => setOpen(false)} open={open}>
        <Dialog.Content className="max-w-sm !pb-4">
          <Dialog.Header border={false} onClose={() => setOpen(false)} title={<Trans>Confirm Swap</Trans>} />
          <div className="grid grid-cols-12 items-center my-4">
            <div className="relative flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-300/40 dark:bg-slate-700/40 border-slate-500/20 dark:border-slate-200/5">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-between w-full gap-2">
                  <Typography className="truncate text-slate-900 dark:text-slate-50" variant="h3" weight={500}>
                    {input0?.toSignificant(6)}{' '}
                  </Typography>
                  <div className="flex items-center justify-end gap-2 text-right">
                    {input0 && (
                      <div className="w-5 h-5">
                        <Icon currency={input0.currency} height={20} width={20} />
                      </div>
                    )}
                    <Typography className="text-right text-slate-900 dark:text-slate-50" variant="h3" weight={500}>
                      {input0?.currency.symbol}
                    </Typography>
                  </div>
                </div>
              </div>
              <Typography className="text-slate-500" variant="sm" weight={500}>
                {value0 ? `$${value0}` : '-'}
              </Typography>
            </div>
            <div className="flex items-center justify-center col-span-12 -mt-2.5 -mb-2.5">
              <div className="p-0.5 bg-slate-300 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-800 ring-1 ring-slate-200/5 z-10 rounded-full">
                <ChevronDownIcon className="text-slate-800 dark:text-slate-200" height={18} width={18} />
              </div>
            </div>
            <div className="flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-300/40 dark:bg-slate-700/40 border-slate-500/20 dark:border-slate-200/5">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-between w-full gap-2">
                  <Typography className="truncate text-slate-900 dark:text-slate-50" variant="h3" weight={500}>
                    {input1?.toSignificant(6)}{' '}
                  </Typography>
                  <div className="flex items-center justify-end gap-2 text-right">
                    {input1 && (
                      <div className="w-5 h-5">
                        <Icon currency={input1.currency} height={20} width={20} />
                      </div>
                    )}
                    <Typography className="text-right text-slate-900 dark:text-slate-50" variant="h3" weight={500}>
                      {input1?.currency.symbol}
                    </Typography>
                  </div>
                </div>
              </div>
              <Typography className="text-slate-500" variant="sm" weight={500}>
                {value1 ? `$${value1}` : '-'}
              </Typography>
            </div>
          </div>
          <Approve
            chainId={chainId}
            className="flex-grow !justify-end"
            components={(
              <Approve.Components>
                <Approve.Token
                  address={routerAddress}
                  amount={input0}
                  chainId={chainId}
                  className="whitespace-nowrap"
                  enabled={input0?.currency?.isToken}
                  fullWidth
                  size="md"
                />
              </Approve.Components>
            )}
            onSuccess={createNotification}
            render={({ approved }) => {
              return (
                <Button
                  disabled={!approved || !sendTransaction || isWritePending}
                  fullWidth
                  onClick={() => sendTransaction?.()}
                  size="md"
                >
                  {isWritePending
                    ? <Dots><Trans>Confirm Swap</Trans></Dots>
                    : <Trans>Swap</Trans>}
                </Button>
              )
            }}
          />
        </Dialog.Content>
      </Dialog>
    </>
  )
}
