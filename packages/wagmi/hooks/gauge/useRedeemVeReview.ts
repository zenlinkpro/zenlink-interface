import type { ParachainId } from '@zenlink-interface/chain'
import { useNotifications } from '@zenlink-interface/shared'
import { type Dispatch, type SetStateAction, useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'
import type { SendTransactionData } from 'wagmi/query'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { t } from '@lingui/macro'
import { encodeFunctionData } from 'viem'
import { config } from '../../client'
import type { WagmiTransactionRequest } from '../../types'
import { useSendTransaction } from '../useSendTransaction'
import { votingEscrow } from '../../abis'
import { veContract } from './config'

interface UseReedeemVeReviewParams {
  chainId: ParachainId
}

type UseRedeemVeReview = (params: UseReedeemVeReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  veAddress: string | undefined
}

export const useRedeemVeReview: UseRedeemVeReview = ({ chainId }) => {
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)
  const contractAddress = veContract[chainId ?? -1]

  const onSettled = useCallback(
    (hash: SendTransactionData | undefined) => {
      if (!hash)
        return

      const ts = new Date().getTime()
      createNotification({
        type: 'leaveBar',
        chainId,
        txHash: hash,
        promise: waitForTransactionReceipt(config, { hash }),
        summary: {
          pending: t`Redeeming unlocked ZLK`,
          completed: t`Successfully redeemed unlocked ZLK`,
          failed: t`Something went wrong when redeeming unlocked ZLK`,
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
        if (!address)
          return

        setRequest({
          account: address,
          to: contractAddress,
          data: encodeFunctionData({ abi: votingEscrow, functionName: 'withdraw' }),
        })
      }
      catch (e: unknown) { }
    },
    [address, contractAddress],
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
