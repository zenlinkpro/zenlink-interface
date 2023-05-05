import type { ParachainId } from '@zenlink-interface/chain'
import { Amount } from '@zenlink-interface/currency'
import type { Type } from '@zenlink-interface/currency'
import { Percent } from '@zenlink-interface/math'
import type { TransactionRequest } from '@zenlink-interface/polkadot'
import { useAccount, useApi, useBlockNumber, useSendTransaction } from '@zenlink-interface/polkadot'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'
import { calculateSlippageAmount } from '@zenlink-interface/amm'
import { addressToZenlinkAssetId } from '@zenlink-interface/format'
import { t } from '@lingui/macro'
import { PairState } from './usePairs'

interface UseAddLiquidityStandardReviewParams {
  chainId: ParachainId
  poolState: PairState
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  setOpen: Dispatch<SetStateAction<boolean>>
}

type UseAddLiquidityStandardReview = (params: UseAddLiquidityStandardReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useAddLiquidityStandardReview: UseAddLiquidityStandardReview = ({
  chainId,
  token0,
  token1,
  input0,
  input1,
  setOpen,
  poolState,
}) => {
  const api = useApi(chainId)
  const { account } = useAccount()
  const [, { createPendingNotification }] = useNotifications(account?.address)
  const blockNumber = useBlockNumber(chainId)
  const [{ slippageTolerance }] = useSettings()

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      input0
        ? poolState === PairState.NOT_EXISTS
          ? input0
          : Amount.fromRawAmount(input0.currency, calculateSlippageAmount(input0, slippagePercent)[0])
        : undefined,
      input1
        ? poolState === PairState.NOT_EXISTS
          ? input1
          : Amount.fromRawAmount(input1.currency, calculateSlippageAmount(input1, slippagePercent)[0])
        : undefined,
    ]
  }, [poolState, input0, input1, slippagePercent])

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<TransactionRequest | undefined>>) => {
      if (
        !chainId
        || !api
        || !token0
        || !token1
        || !input0
        || !input1
        || !account
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
          input0.quotient.toString(),
          input1.quotient.toString(),
          minAmount0.quotient.toString(),
          minAmount1.quotient.toString(),
          deadline,
        ]
        const extrinsic = [api.tx.zenlinkProtocol.addLiquidity(...args)]

        const ts = new Date().getTime()
        const notification: TransactionRequest['notification'] = {
          type: 'mint',
          chainId,
          summary: {
            pending: t`Adding liquidity to the ${token0.symbol}/${token1.symbol} pair`,
            completed: t`Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`,
            failed: t`Something went wrong when adding liquidity`,
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
    [account, api, blockNumber, chainId, input0, input1, minAmount0, minAmount1, token0, token1],
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    createPendingNotification,
    prepare,
    onSuccess: (status) => {
      if (status)
        setOpen(false)
    },
  })

  return useMemo(() => ({
    isWritePending,
    sendTransaction,
    routerAddress: undefined,
  }), [isWritePending, sendTransaction])
}
