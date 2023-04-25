import { t } from '@lingui/macro'
import type { ParachainId } from '@zenlink-interface/chain'
import type { TransactionRequest } from '@zenlink-interface/polkadot'
import { useAccount, useApi, useSendTransaction } from '@zenlink-interface/polkadot'
import { useNotifications } from '@zenlink-interface/shared'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'

interface UseClaimFarmingRewardsReviewParams {
  chainId: ParachainId
  farmAddress?: string
  pid: number
}

type UseClaimFarmingRewardsReview = (params: UseClaimFarmingRewardsReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  farmAddress: string | undefined
}

export const useClaimFarmingRewardsReview: UseClaimFarmingRewardsReview = ({
  chainId,
  pid,
}) => {
  const api = useApi(chainId)
  const { account } = useAccount()
  const [, { createPendingNotification }] = useNotifications(account?.address)

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<TransactionRequest | undefined>>) => {
      if (!chainId || !api || !account)
        return

      try {
        const args = [pid]
        const extrinsic = [api.tx.farming.claim(...args)]

        const ts = new Date().getTime()
        const notification: TransactionRequest['notification'] = {
          type: 'burn',
          chainId,
          summary: {
            pending: t`Claiming Rewards`,
            completed: t`Successfully claimed rewards`,
            failed: t`Something went wrong when claim rewards`,
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
    [account, api, chainId, pid],
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
