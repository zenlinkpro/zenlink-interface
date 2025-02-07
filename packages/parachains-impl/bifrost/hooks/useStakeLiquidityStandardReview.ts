import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Type } from '@zenlink-interface/currency'
import type { TransactionRequest } from '@zenlink-interface/polkadot'
import type { Dispatch, SetStateAction } from 'react'
import { t } from '@lingui/core/macro'
import { useAccount, useApi, useSendTransaction } from '@zenlink-interface/polkadot'
import { useNotifications } from '@zenlink-interface/shared'
import { useCallback, useMemo } from 'react'

interface UseStakeLiquidityStandardReviewParams {
  chainId: ParachainId
  pid: number
  amountToStake: Amount<Type> | undefined
}

type UseStakeLiquidityStandardReview = (params: UseStakeLiquidityStandardReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  farmAddress: string | undefined
}

export const useStakeLiquidityStandardReview: UseStakeLiquidityStandardReview = ({
  chainId,
  amountToStake,
  pid,
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
        || !amountToStake
      ) {
        return
      }

      try {
        const args = [
          pid,
          amountToStake?.quotient.toString() ?? '0',
          null,
        ]
        const extrinsic = [api.tx.farming.deposit(...args)]

        const ts = new Date().getTime()
        const notification: TransactionRequest['notification'] = {
          type: 'burn',
          chainId,
          summary: {
            pending: t`Staking ${amountToStake?.toSignificant(6)} ${amountToStake?.currency.symbol || 'symbol'}`,
            completed: t`Successfully stake ${amountToStake?.toSignificant(6)} ${amountToStake?.currency.symbol || 'symbol'}`,
            failed: t`Something went wrong when stake ${amountToStake?.toSignificant(6)} ${amountToStake?.currency.symbol || 'symbol'}`,
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
    [account, amountToStake, api, chainId, pid],
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
