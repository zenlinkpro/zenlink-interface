import { Trans } from '@lingui/macro'
import type { Market } from '@zenlink-interface/market'
import { Button, Dialog, Dots } from '@zenlink-interface/ui'
import { type FC, type ReactNode, useState } from 'react'
import type { Amount, Token } from '@zenlink-interface/currency'
import { Approve, useAccount } from '@zenlink-interface/compat'
import { useNotifications } from '@zenlink-interface/shared'
import { useRedeemPyReview } from '@zenlink-interface/wagmi'
import { MarketRedeemWidget } from './MarketMintAndRedeem'

interface MarketRedeemReviewModalProps {
  market: Market
  children: ({ isWritePending, setOpen }: { isWritePending: boolean, setOpen: (open: boolean) => void }) => ReactNode
  inputValue: string
  ptToRedeem?: Amount<Token>
  ytToRedeem?: Amount<Token>
  pyRedeemed: Amount<Token>
}

export const MarketRedeemReviewModal: FC<MarketRedeemReviewModalProps> = ({
  market,
  children,
  inputValue,
  ptToRedeem,
  ytToRedeem,
  pyRedeemed,
}) => {
  const [open, setOpen] = useState(false)
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)

  const { isWritePending, sendTransaction, routerAddress } = useRedeemPyReview({
    chainId: market.chainId,
    market,
    pyRedeemed,
    pyToRedeem: ptToRedeem,
    setOpen,
  })

  return (
    <>
      {children({ isWritePending: false, setOpen })}
      <Dialog onClose={() => setOpen(false)} open={open}>
        <Dialog.Content className="max-w-sm !pb-4 !bg-slate-100 dark:!bg-slate-800">
          <Dialog.Header border={false} onClose={() => setOpen(false)} title={<Trans>Redeem</Trans>} />
          <MarketRedeemWidget inputValue={inputValue} market={market} pyRedeemed={pyRedeemed} />
          <Approve
            chainId={market.chainId}
            className="flex-grow !justify-end"
            components={(
              <Approve.Components>
                <Approve.Token
                  address={routerAddress}
                  amount={ptToRedeem}
                  chainId={market.chainId}
                  className="whitespace-nowrap"
                  fullWidth
                  size="md"
                />
                {!market.isExpired
                  ? (
                    <Approve.Token
                      address={routerAddress}
                      amount={ytToRedeem}
                      chainId={market.chainId}
                      className="whitespace-nowrap"
                      fullWidth
                      size="md"
                    />
                    )
                  : <></>}
              </Approve.Components>
            )}
            onSuccess={createNotification}
            render={({ approved }) => {
              return (
                <Button disabled={!approved || isWritePending} fullWidth onClick={() => sendTransaction?.()} size="md">
                  {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : <Trans>Redeem</Trans>}
                </Button>
              )
            }}
          />
        </Dialog.Content>
      </Dialog>
    </>
  )
}
