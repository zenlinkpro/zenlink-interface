import type { Trade } from '@zenlink-interface/amm'
import { Percent } from '@zenlink-interface/math'
import type { TransactionRequest } from '@zenlink-interface/polkadot'
import { useAccount, useApi, useBlockNumber, useSendTransaction } from '@zenlink-interface/polkadot'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'
import { t } from '@lingui/macro'
import { SwapRouter } from '../SwapRouter'

const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // 0.50%

interface UseSwapReviewParams {
  chainId: number | undefined
  trade: Trade | undefined
  setOpen: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string | undefined>>
  onSuccess(): void
}

type UseSwapReview = (params: UseSwapReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => Promise<void>) | undefined
  routerAddress: string | undefined
}

export const useSwapReview: UseSwapReview = ({
  chainId,
  trade,
  setOpen,
  setError,
  onSuccess,
}) => {
  const api = useApi(chainId)
  const { account } = useAccount()
  const [, { createPendingNotification }] = useNotifications(account?.address)
  const blockNumber = useBlockNumber(chainId)
  const [{ slippageTolerance }] = useSettings()

  const allowedSlippage = useMemo(
    () => (slippageTolerance ? new Percent(slippageTolerance * 100, 10_000) : SWAP_DEFAULT_SLIPPAGE),
    [slippageTolerance],
  )

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<TransactionRequest | undefined>>) => {
      if (!chainId || !api || !trade || !account)
        return

      // Deadline is currently default to next 20 blocks
      try {
        const deadline = blockNumber && blockNumber.toNumber() + 20
        if (trade && deadline) {
          const { extrinsic } = SwapRouter.swapCallParameters(
            trade,
            {
              api,
              allowedSlippage,
              recipient: account.address,
              deadline,
            },
          )

          const ts = new Date().getTime()
          const notification: TransactionRequest['notification'] = {
            type: 'swap',
            chainId,
            summary: {
              pending: t`Swapping ${trade.inputAmount.toSignificant(6)} ${trade.inputAmount.currency.symbol
                } for ${trade.outputAmount.toSignificant(6)} ${trade.outputAmount.currency.symbol}`,
              completed: t`Successfully swapped ${trade.inputAmount.toSignificant(6)} ${trade.inputAmount.currency.symbol
                } for ${trade.outputAmount.toSignificant(6)} ${trade.outputAmount.currency.symbol}`,
              failed: t`Something went wrong when trying to swap ${trade.inputAmount.currency.symbol} for ${trade.outputAmount.currency.symbol}`,
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
      }
      catch (e: any) {
        setError(e?.message)
        console.error(e)
      }
    },
    [account, allowedSlippage, api, blockNumber, chainId, setError, trade],
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    createPendingNotification,
    prepare,
    onSuccess: (status) => {
      if (status) {
        setOpen(false)
        onSuccess()
      }
    },
  })

  return useMemo(() => ({
    isWritePending,
    sendTransaction,
    routerAddress: undefined,
  }), [isWritePending, sendTransaction])
}
