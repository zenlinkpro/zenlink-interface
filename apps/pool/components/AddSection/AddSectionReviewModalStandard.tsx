import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Type } from '@zenlink-interface/currency'
import { Button, Dots } from '@zenlink-interface/ui'
import type { FC, ReactNode } from 'react'
import { useMemo, useState } from 'react'

import { useNotifications } from '@zenlink-interface/shared'
import type { PairState } from '@zenlink-interface/compat'
import { Approve, useAccount, useAddLiquidityStandardReview } from '@zenlink-interface/compat'
import { Trans, t } from '@lingui/macro'
import { AddSectionReviewModal } from './AddSectionReviewModal'

interface AddSectionReviewModalStandardProps {
  poolState: PairState
  chainId: ParachainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  children({ isWritePending, setOpen }: { isWritePending: boolean, setOpen(open: boolean): void }): ReactNode
}

export const AddSectionReviewModalStandard: FC<AddSectionReviewModalStandardProps> = ({
  poolState,
  chainId,
  token0,
  token1,
  input0,
  input1,
  children,
}) => {
  const [open, setOpen] = useState(false)
  const { address } = useAccount()

  const [, { createNotification }] = useNotifications(address)

  const { sendTransaction, isWritePending, routerAddress } = useAddLiquidityStandardReview({
    chainId,
    token0,
    token1,
    input0,
    input1,
    setOpen,
    poolState,
  })

  return useMemo(
    () => (
      <>
        {children({ isWritePending, setOpen })}
        <AddSectionReviewModal chainId={chainId} input0={input0} input1={input1} open={open} setOpen={setOpen}>
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
                  fullWidth
                  size="md"
                />
                <Approve.Token
                  address={routerAddress}
                  amount={input1}
                  chainId={chainId}
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
                  {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : t`Add`}
                </Button>
              )
            }}
          />
        </AddSectionReviewModal>
      </>
    ),
    [chainId, children, createNotification, input0, input1, isWritePending, open, routerAddress, sendTransaction],
  )
}
