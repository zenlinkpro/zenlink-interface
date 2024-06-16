import { Trans } from '@lingui/macro'
import type { Market } from '@zenlink-interface/market'
import { Button, Dialog, Dots } from '@zenlink-interface/ui'
import { type FC, type ReactNode, useState } from 'react'
import type { Amount, Token } from '@zenlink-interface/currency'
import { Approve, useAccount } from '@zenlink-interface/compat'
import { useNotifications } from '@zenlink-interface/shared'
import { useAddManualReview } from '@zenlink-interface/wagmi'
import { MarketAddManualWidget } from './MarketAddManual'

interface MarketAddManualReviewModalProps {
  market: Market
  children: ({ isWritePending, setOpen }: { isWritePending: boolean, setOpen: (open: boolean) => void }) => ReactNode
  tokenInputValue: string
  ptInputValue: string
  parsedTokenInput?: Amount<Token>
  parsedPtInput?: Amount<Token>
  lpMinted: Amount<Token>
  onSuccess: () => void
}

export const MarketAddManualReviewModal: FC<MarketAddManualReviewModalProps> = ({
  market,
  children,
  tokenInputValue,
  ptInputValue,
  parsedTokenInput,
  parsedPtInput,
  lpMinted,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false)
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)

  const { isWritePending, sendTransaction, routerAddress } = useAddManualReview({
    chainId: market.chainId,
    market,
    tokenAmount: parsedTokenInput,
    ptAmount: parsedPtInput,
    onSuccess,
    lpMinted,
    setOpen,
  })

  return (
    <>
      {children({ isWritePending, setOpen })}
      <Dialog onClose={() => setOpen(false)} open={open}>
        <Dialog.Content className="max-w-sm !pb-4 !bg-slate-100 dark:!bg-slate-800">
          <Dialog.Header border={false} onClose={() => setOpen(false)} title={<Trans>Add Manual</Trans>} />
          <MarketAddManualWidget
            lpMinted={lpMinted}
            market={market}
            ptInputValue={ptInputValue}
            tokenInputValue={tokenInputValue}
          />
          <Approve
            chainId={market.chainId}
            className="flex-grow !justify-end"
            components={(
              <Approve.Components>
                <Approve.Token
                  address={routerAddress}
                  amount={parsedTokenInput}
                  chainId={market.chainId}
                  className="whitespace-nowrap"
                  fullWidth
                  size="md"
                />
                <Approve.Token
                  address={routerAddress}
                  amount={parsedPtInput}
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
                <Button className="mt-2" disabled={!approved || isWritePending} fullWidth onClick={() => sendTransaction?.()} size="md">
                  {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : <Trans>Add</Trans>}
                </Button>
              )
            }}
          />
        </Dialog.Content>
      </Dialog>
    </>
  )
}
