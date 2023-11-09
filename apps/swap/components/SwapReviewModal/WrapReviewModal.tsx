import { Trans, t } from '@lingui/macro'
import type { Amount, Type } from '@zenlink-interface/currency'
import { useNotifications } from '@zenlink-interface/shared'
import { Button, Dots } from '@zenlink-interface/ui'
import { WrapType, useWrapCallback } from '@zenlink-interface/wagmi'
import type { FC, ReactNode } from 'react'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'

import { SwapReviewModalBase } from './SwapReviewModalBase'

interface WrapReviewModalProps {
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  wrapType: WrapType
  chainId: number | undefined
  children({ isWritePending, setOpen }: { isWritePending: boolean; setOpen(open: boolean): void }): ReactNode
}

export const WrapReviewModal: FC<WrapReviewModalProps> = ({ input0, input1, wrapType, chainId, children }) => {
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)
  const [open, setOpen] = useState(false)

  const { sendTransaction, isLoading: isWritePending } = useWrapCallback({
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
        <Button size="md" disabled={isWritePending} fullWidth onClick={() => sendTransaction?.()}>
          {isWritePending
            ? (
              <Dots>
                <Trans>
                  Confirm {wrapType === WrapType.Wrap ? 'Wrap' : 'Unwrap'}
                </Trans>
              </Dots>
              )
            : wrapType === WrapType.Wrap
              ? t`Wrap`
              : t`Unwrap`}
        </Button>
      </SwapReviewModalBase>
    </>
  )
}
