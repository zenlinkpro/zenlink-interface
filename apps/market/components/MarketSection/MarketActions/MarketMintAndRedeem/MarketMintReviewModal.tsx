import { Trans } from '@lingui/macro'
import type { Market } from '@zenlink-interface/market'
import { Button, Dialog, Dots } from '@zenlink-interface/ui'
import { type FC, type ReactNode, useState } from 'react'
import { Approve, useAccount } from '@zenlink-interface/compat'
import { useNotifications } from '@zenlink-interface/shared'
import { useMintPyReview } from '@zenlink-interface/wagmi'
import type { Type } from '@zenlink-interface/currency'
import { MarketMintWidget } from './MarkeMint'
import { useMintTrade } from './MintTradeProvider'

interface MarketMintReviewModalProps {
  market: Market
  children: ({ isWritePending, setOpen }: { isWritePending: boolean, setOpen: (open: boolean) => void }) => ReactNode
  mintToken: Type
  mintInput: string
  onSuccess: () => void
}

export const MarketMintReviewModal: FC<MarketMintReviewModalProps> = ({
  market,
  children,
  mintToken,
  onSuccess,
  mintInput,
}) => {
  const [open, setOpen] = useState(false)
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)

  const { ptMinted, ytMinted, trade, amountSpecified } = useMintTrade()

  const { isWritePending, sendTransaction, routerAddress } = useMintPyReview({
    chainId: market.chainId,
    market,
    trade,
    amountSpecified,
    ptMinted,
    ytMinted,
    setOpen,
    onSuccess,
  })

  return (
    <>
      {children({ isWritePending, setOpen })}
      <Dialog onClose={() => setOpen(false)} open={open}>
        <Dialog.Content className="max-w-sm !pb-4 !bg-slate-100 dark:!bg-slate-800">
          <Dialog.Header border={false} onClose={() => setOpen(false)} title={<Trans>Mint</Trans>} />
          <MarketMintWidget market={market} mintInput={mintInput} mintToken={mintToken} previewMode />
          <Approve
            chainId={market.chainId}
            className="flex-grow !justify-end"
            components={(
              <Approve.Components>
                <Approve.Token
                  address={routerAddress}
                  amount={amountSpecified}
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
                  {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : <Trans>Mint</Trans>}
                </Button>
              )
            }}
          />
        </Dialog.Content>
      </Dialog>
    </>
  )
}
