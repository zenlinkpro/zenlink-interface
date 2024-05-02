import { Trans } from '@lingui/macro'
import type { Market } from '@zenlink-interface/market'
import { Button, Dialog, Dots } from '@zenlink-interface/ui'
import { type FC, type ReactNode, useState } from 'react'
import type { Amount, Token } from '@zenlink-interface/currency'
import { Approve, useAccount } from '@zenlink-interface/compat'
import { useNotifications } from '@zenlink-interface/shared'
import { useMintPyReview } from '@zenlink-interface/wagmi'
import { MarketMintWidget } from './MarkeMint'

interface MarketMintReviewModalProps {
  market: Market
  children: ({ isWritePending, setOpen }: { isWritePending: boolean, setOpen: (open: boolean) => void }) => ReactNode
  inputValue: string
  yieldToMints?: Amount<Token>
  ptMinted: Amount<Token>
  ytMinted: Amount<Token>
}

export const MarketMintReviewModal: FC<MarketMintReviewModalProps> = ({
  market,
  children,
  inputValue,
  ptMinted,
  ytMinted,
  yieldToMints,
}) => {
  const [open, setOpen] = useState(false)
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)

  const { isWritePending, sendTransaction, routerAddress } = useMintPyReview({
    chainId: market.chainId,
    market,
    yieldToMints,
    ptMinted,
    ytMinted,
    setOpen,
  })

  return (
    <>
      {children({ isWritePending: false, setOpen })}
      <Dialog onClose={() => setOpen(false)} open={open}>
        <Dialog.Content className="max-w-sm !pb-4 !bg-slate-100 dark:!bg-slate-800">
          <Dialog.Header border={false} onClose={() => setOpen(false)} title={<Trans>Mint</Trans>} />
          <MarketMintWidget inputValue={inputValue} market={market} ptMinted={ptMinted} ytMinted={ytMinted} />
          <Approve
            chainId={market.chainId}
            className="flex-grow !justify-end"
            components={(
              <Approve.Components>
                <Approve.Token
                  address={routerAddress}
                  amount={yieldToMints}
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
