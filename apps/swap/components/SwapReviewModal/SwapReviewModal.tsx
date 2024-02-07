import type { FC, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Button, Dots } from '@zenlink-interface/ui'
import { useNotifications } from '@zenlink-interface/shared'
import { Approve, useAccount, useSwapReview } from '@zenlink-interface/compat'
import { Trans } from '@lingui/macro'
import type { Permit2Actions } from '@zenlink-interface/wagmi'
import { ParachainId } from '@zenlink-interface/chain'
import { useTrade } from '../TradeProvider'
import { SwapReviewModalBase } from './SwapReviewModalBase'

interface SwapReviewModalProps {
  chainId: number
  children: ({ isWritePending, setOpen }: { isWritePending: boolean, setOpen: (open: boolean) => void }) => ReactNode
  onSuccess: () => void
}

const INTERGRATED_PERMIT2_CHAINS = [
  ParachainId.MOONBEAM,
  ParachainId.BASE,
]

export const SwapReviewModal: FC<SwapReviewModalProps> = ({ chainId, children, onSuccess }) => {
  const { trade } = useTrade()
  const { address: account } = useAccount()
  const [, { createNotification }] = useNotifications(account)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [permit2Actions, setPermit2Actions] = useState<Permit2Actions>()

  const [input0, input1] = useMemo(
    () => [trade?.inputAmount, trade?.outputAmount],
    [trade?.inputAmount, trade?.outputAmount],
  )

  const enablePermit2 = useMemo(() => INTERGRATED_PERMIT2_CHAINS.includes(chainId), [chainId])

  const { isWritePending, sendTransaction, routerAddress } = useSwapReview({
    chainId,
    enablePermit2,
    onSuccess,
    open,
    permit2Actions,
    setError,
    setOpen,
    trade,
  })

  return (
    <>
      {children({ isWritePending, setOpen })}
      <SwapReviewModalBase
        chainId={chainId}
        error={error}
        input0={input0}
        input1={input1}
        open={open}
        setOpen={setOpen}
      >
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
                enablePermit2={enablePermit2}
                enabled={trade?.inputAmount?.currency?.isToken}
                fullWidth
                permit2Actions={permit2Actions}
                setPermit2Actions={setPermit2Actions}
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
                {
                  !sendTransaction
                    ? <Dots><Trans>Simulate Swap</Trans></Dots>
                    : isWritePending
                      ? <Dots><Trans>Confirm Swap</Trans></Dots>
                      : <Trans>Swap</Trans>
                }
              </Button>
            )
          }}
        />
      </SwapReviewModalBase>
    </>
  )
}
