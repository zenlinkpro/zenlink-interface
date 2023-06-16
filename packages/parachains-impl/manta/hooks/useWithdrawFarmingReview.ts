import { t } from '@lingui/macro'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Type } from '@zenlink-interface/currency'
import type { TransactionRequest } from '@zenlink-interface/polkadot'
import { useAccount, useApi, useSendTransaction } from '@zenlink-interface/polkadot'
import { useNotifications } from '@zenlink-interface/shared'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'

interface UseWithdrawFarmingReviewParams {
  chainId: ParachainId
  pid: number
  amountToWithdraw: Amount<Type> | undefined
}

type UseWithdrawFarmingReview = (params: UseWithdrawFarmingReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  farmAddress: string | undefined
}

export const useWithdrawFarmingReview: UseWithdrawFarmingReview = ({
  chainId,
  pid,
  amountToWithdraw,
}) => {
  const api = useApi(chainId)
  const { account } = useAccount()
  const [, { createPendingNotification }] = useNotifications(account?.address)

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<TransactionRequest | undefined>>) => {
      if (
        !chainId
        || !api
        || !account
        || !amountToWithdraw
      )
        return

      try {
        const args = [
          pid,
          amountToWithdraw?.quotient.toString() ?? '0',
        ]
        const extrinsic = [
          api.tx.farming.withdraw(...args),
          api.tx.farming.withdrawClaim(pid),
        ]

        const ts = new Date().getTime()
        const notification: TransactionRequest['notification'] = {
          type: 'burn',
          chainId,
          summary: {
            pending: t`Unstaking ${amountToWithdraw?.toSignificant(6)} ${amountToWithdraw?.currency.symbol}`,
            completed: t`Successfully unstaked ${amountToWithdraw?.toSignificant(6)} ${amountToWithdraw?.currency.symbol}`,
            failed: t`Something went wrong when unstake ${amountToWithdraw?.toSignificant(6)} ${amountToWithdraw?.currency.symbol}`,
          },
          timestamp: ts,
          groupTimestamp: ts,
        }

        setRequest({
          extrinsic,
          account,
          notification,
        })
      }
      catch (e: unknown) {}
    },
    [account, amountToWithdraw, api, chainId, pid],
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    createPendingNotification,
    prepare,
    onSuccess: () => {},
  })

  return useMemo(() => ({
    isWritePending,
    sendTransaction,
    farmAddress: undefined,
  }), [isWritePending, sendTransaction])
}
