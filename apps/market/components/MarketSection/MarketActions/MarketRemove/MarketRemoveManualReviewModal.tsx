import { Approve, useAccount } from '@zenlink-interface/compat'
import type { Amount, Token, Type } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import { useNotifications } from '@zenlink-interface/shared'
import { Button, Dialog, Dots } from '@zenlink-interface/ui'
import { useRemoveManualReview } from '@zenlink-interface/wagmi'
import { type FC, type ReactNode, useState } from 'react'
import { Trans } from '@lingui/macro'
import { MarketRemoveManualWidget } from './MarketRemoveManual'

interface MarketRemoveManualModalProps {
  market: Market
  children: ({ isWritePending, setOpen }: { isWritePending: boolean, setOpen: (open: boolean) => void }) => ReactNode
  lpToRemove?: Amount<Type>
  tokenRemoved?: Amount<Token>
  ptRemoved?: Amount<Token>
  removeInputValue?: string
}

export const MarketRemoveManualReviewModal: FC<MarketRemoveManualModalProps> = ({
  market,
  children,
  lpToRemove,
  tokenRemoved,
  ptRemoved,
  removeInputValue,
}) => {
  const [open, setOpen] = useState(false)
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)

  const { isWritePending, sendTransaction, routerAddress } = useRemoveManualReview({
    chainId: market.chainId,
    market,
    lpToRemove,
    tokenRemoved,
    ptRemoved,
    setOpen,
  })

  return (
    <>
      {children({ isWritePending, setOpen })}
      <Dialog onClose={() => setOpen(false)} open={open}>
        <Dialog.Content className="max-w-sm !pb-4 !bg-slate-100 dark:!bg-slate-800">
          <Dialog.Header border={false} onClose={() => setOpen(false)} title={<Trans>Mint</Trans>} />
          <MarketRemoveManualWidget
            lpToRemove={lpToRemove}
            market={market}
            ptRemoved={ptRemoved}
            removeInputValue={removeInputValue}
            tokenRemoved={tokenRemoved}
          />
          <Approve
            chainId={market.chainId}
            className="flex-grow !justify-end"
            components={(
              <Approve.Components>
                <Approve.Token
                  address={routerAddress}
                  amount={lpToRemove}
                  chainId={market.chainId}
                  className="whitespace-nowrap"
                  fullWidth
                  size="md"
                />
              </Approve.Components>
            )}
            onSuccess={createNotification}
            render={({ approved }) => {
              return (
                <Button disabled={!approved || isWritePending} fullWidth onClick={() => sendTransaction?.()} size="md">
                  {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : <Trans>Remove</Trans>}
                </Button>
              )
            }}
          />
        </Dialog.Content>
      </Dialog>
    </>
  )
}
