import { t } from '@lingui/macro'
import type { Pair } from '@zenlink-interface/amm'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Type } from '@zenlink-interface/currency'
import { addressToZenlinkAssetId } from '@zenlink-interface/format'
import type { Percent } from '@zenlink-interface/math'
import type { TransactionRequest } from '@zenlink-interface/polkadot'
import { useAccount, useApi, useBlockNumber, useSendTransaction } from '@zenlink-interface/polkadot'
import { useNotifications } from '@zenlink-interface/shared'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'

interface UseRemoveLiquidityStandardReviewParams {
  chainId: ParachainId
  token0: Type
  token1: Type
  minAmount0: Amount<Type> | undefined
  minAmount1: Amount<Type> | undefined
  pool: Pair | null
  percentToRemove: Percent
  balance: Amount<Type> | undefined
}

type UseRemoveLiquidityStandardReview = (params: UseRemoveLiquidityStandardReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useRemoveLiquidityStandardReview: UseRemoveLiquidityStandardReview = ({
  chainId,
  token0,
  token1,
  percentToRemove,
  minAmount0,
  minAmount1,
  balance,
  pool,
}) => {
  const api = useApi(chainId)
  const { account } = useAccount()
  const [, { createPendingNotification }] = useNotifications(account?.address)
  const blockNumber = useBlockNumber(chainId)

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<TransactionRequest | undefined>>) => {
      if (
        !chainId
        || !api
        || !pool
        || !token0
        || !token1
        || !account
        || !balance
        || !minAmount0
        || !minAmount1
      )
        return

      // Deadline is currently default to next 20 blocks
      try {
        const deadline = blockNumber && blockNumber.toNumber() + 20
        const args = [
          addressToZenlinkAssetId(token0.wrapped.address),
          addressToZenlinkAssetId(token1.wrapped.address),
          balance.multiply(percentToRemove).quotient.toString(),
          minAmount0.quotient.toString(),
          minAmount1.quotient.toString(),
          account.address,
          deadline,
        ]
        const extrinsic = [api.tx.zenlinkProtocol.removeLiquidity(...args)]

        const ts = new Date().getTime()
        const notification: TransactionRequest['notification'] = {
          type: 'burn',
          chainId: pool.chainId,
          summary: {
            pending: t`Removing liquidity from the ${token0.symbol}/${token1.symbol} pair`,
            completed: t`Successfully removed liquidity from the ${token0.symbol}/${token1.symbol} pair`,
            failed: t`Something went wrong when removing liquidity`,
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
    [account, api, balance, blockNumber, chainId, minAmount0, minAmount1, percentToRemove, pool, token0, token1],
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
    routerAddress: undefined,
  }), [isWritePending, sendTransaction])
}
