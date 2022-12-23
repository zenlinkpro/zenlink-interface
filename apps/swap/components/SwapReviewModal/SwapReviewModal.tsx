import type { FC, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { useSwapReview } from '@zenlink-interface/wagmi'
import { Button, Dots } from '@zenlink-interface/ui'
import { useNotifications } from '@zenlink-interface/shared'
import { Approve } from '@zenlink-interface/compat'
import { useTrade } from '../TradeProvider'
import { SwapReviewModalBase } from './SwapReviewModalBase'

interface SwapReviewModalProps {
  chainId: number | undefined
  children({ isWritePending, setOpen }: { isWritePending: boolean; setOpen(open: boolean): void }): ReactNode
  onSuccess(): void
}

export const SwapReviewModal: FC<SwapReviewModalProps> = ({ chainId, children, onSuccess }) => {
  const { trade } = useTrade()
  const { address: account } = useAccount()
  const [, { createNotification }] = useNotifications(account)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()

  const [input0, input1] = useMemo(
    () => [trade?.inputAmount, trade?.outputAmount],
    [trade?.inputAmount, trade?.outputAmount],
  )

  const { isWritePending, sendTransaction, routerAddress } = useSwapReview({
    chainId,
    trade,
    open,
    setOpen,
    setError,
    onSuccess,
    enableNetworks: [2004, 2023, 2006],
  })

  return (
    <>
      {children({ isWritePending, setOpen })}
      <SwapReviewModalBase
        chainId={chainId}
        input0={input0}
        input1={input1}
        open={open}
        setOpen={setOpen}
        error={error}
      >
        <Approve
          chainId={chainId}
          onSuccess={createNotification}
          className="flex-grow !justify-end"
          components={
            <Approve.Components>
              <Approve.Token
                chainId={chainId}
                size="md"
                className="whitespace-nowrap"
                fullWidth
                amount={input0}
                address={routerAddress}
                enabled={trade?.inputAmount?.currency?.isToken}
              />
            </Approve.Components>
          }
          render={({ approved }) => {
            return (
              <Button size="md" disabled={!approved || isWritePending} fullWidth onClick={() => sendTransaction?.()}>
                {isWritePending ? <Dots>Confirm Swap</Dots> : 'Swap'}
              </Button>
            )
          }}
        />
      </SwapReviewModalBase>
    </>
  )
}
