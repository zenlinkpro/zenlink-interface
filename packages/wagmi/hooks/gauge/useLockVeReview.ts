import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Token } from '@zenlink-interface/currency'
import type { Dispatch, SetStateAction } from 'react'
import type { SendTransactionData } from 'wagmi/query'
import type { WagmiTransactionRequest } from '../../types'
import { t } from '@lingui/core/macro'
import { useNotifications } from '@zenlink-interface/shared'
import { useCallback, useMemo } from 'react'
import { encodeFunctionData } from 'viem'
import { useAccount } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { votingEscrow } from '../../abis'
import { config } from '../../client'
import { useSendTransaction } from '../useSendTransaction'
import { veContract } from './config'

interface UseLockVeReviewParams {
  chainId: ParachainId
  amount: Amount<Token> | undefined
  newExpiry: number | undefined
  onSuccess: () => void
}

type UseLockVeReview = (params: UseLockVeReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  veAddress: string | undefined
}

export const useLockVeReview: UseLockVeReview = ({
  chainId,
  amount,
  newExpiry,
  onSuccess,
}) => {
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)
  const contractAddress = veContract[chainId ?? -1]

  const onSettled = useCallback(
    (hash: SendTransactionData | undefined) => {
      if (!hash)
        return

      const ts = new Date().getTime()
      createNotification({
        type: 'enterBar',
        chainId,
        txHash: hash,
        promise: waitForTransactionReceipt(config, { hash }),
        summary: {
          pending: t`Increasing voting power and/or increasing the lock time`,
          completed: t`Successfully increased voting power and/or increased the lock time`,
          failed: t`Something went wrong when increasing voting power`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification],
  )

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<WagmiTransactionRequest | undefined>>) => {
      try {
        if (!address || !newExpiry)
          return

        const args: [bigint, bigint] = [
          amount ? BigInt(amount.quotient.toString()) : BigInt(0),
          BigInt(newExpiry),
        ]

        setRequest({
          account: address,
          to: contractAddress,
          data: encodeFunctionData({ abi: votingEscrow, functionName: 'increaseLockPosition', args }),
        })
      }
      catch { }
    },
    [address, amount, contractAddress, newExpiry],
  )

  const {
    estimateGas,
    request,
    useSendTransactionReturn: {
      sendTransaction,
      isPending: isWritePending,
    },
  } = useSendTransaction({
    mutation: {
      onSettled,
      onSuccess,
    },
    chainId,
    prepare,
  })

  return useMemo(() => ({
    isWritePending,
    sendTransaction: request && estimateGas
      ? () => sendTransaction({ ...request })
      : undefined,
    veAddress: contractAddress,
  }), [contractAddress, estimateGas, isWritePending, request, sendTransaction])
}
