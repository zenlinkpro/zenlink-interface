import type { Amount, Type } from '@zenlink-interface/currency'
import type { FC, ReactNode } from 'react'
import { Trans } from '@lingui/macro'
import { useNotifications } from '@zenlink-interface/shared'
import { Button, Dots } from '@zenlink-interface/ui'
import { useWrapCallback, WrapType } from '@zenlink-interface/wagmi'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'

import { SwapReviewModalBase } from './SwapReviewModalBase'

interface WrapReviewModalProps {
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  wrapType: WrapType
  chainId: number | undefined
  children: ({ isWritePending, setOpen }: { isWritePending: boolean, setOpen: (open: boolean) => void }) => ReactNode
}

export const WrapReviewModal: FC<WrapReviewModalProps> = ({ input0, input1, wrapType, chainId, children }) => {
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)
  const [open, setOpen] = useState(false)

  const {
    request,
    estimateGas,
    useSendTransactionReturn: {
      sendTransaction,
      isPending: isWritePending,
    },
  } = useWrapCallback({
    amount: input0,
    chainId,
    onSuccess: (data) => {
      if (data) {
        setOpen(false)
        createNotification(data)
      }
    },
    wrapType,
  })

  return (
    <>
      {children({ isWritePending, setOpen })}
      <SwapReviewModalBase chainId={chainId} input0={input0} input1={input1} open={open} setOpen={setOpen}>
        <Button
          disabled={isWritePending}
          fullWidth
          onClick={request && estimateGas ? () => sendTransaction({ ...request }) : undefined}
          size="md"
        >
          {
            isWritePending
              ? (
                  <Dots>
                    <Trans>
                      Confirm {wrapType === WrapType.Wrap ? 'Wrap' : 'Unwrap'}
                    </Trans>
                  </Dots>
                )
              : wrapType === WrapType.Wrap
                ? <Trans>Wrap</Trans>
                : <Trans>Unwrap</Trans>
          }
        </Button>
      </SwapReviewModalBase>
    </>
  )
}
