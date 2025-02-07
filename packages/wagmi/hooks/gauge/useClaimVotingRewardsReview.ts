import type { ParachainId } from '@zenlink-interface/chain'
import type { Dispatch, SetStateAction } from 'react'
import type { Address, Hex } from 'viem'
import type { SendTransactionData } from 'wagmi/query'
import type { z } from 'zod'
import type { WagmiTransactionRequest } from '../../types'
import type { votingResultValidator } from './useCheckVotingRewards'
import { t } from '@lingui/core/macro'
import { useNotifications } from '@zenlink-interface/shared'
import { useCallback, useMemo } from 'react'
import { encodeFunctionData } from 'viem'
import { useAccount } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { multicallV2 } from '../../abis'
import { merkle } from '../../abis/merkle'
import { config } from '../../client'
import { useSendTransaction } from '../useSendTransaction'

interface UseClaimVotingRewardsReviewParams {
  chainId: ParachainId
  rewardsData: z.infer<typeof votingResultValidator>
}

type UseClaimVotingRewardsReview = (params: UseClaimVotingRewardsReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
}

export const useClaimVotingRewardsReview: UseClaimVotingRewardsReview = ({
  chainId,
  rewardsData,
}) => {
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)

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
          pending: t`Claiming voting rewards`,
          completed: t`Successfully claimed voting rewards`,
          failed: t`Something went wrong when claiming voting rewards`,
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
        if (!address || !rewardsData.length)
          return

        const args: [{ target: Address, callData: Hex }[]] = [
          rewardsData.map(data => ({
            target: data.contractAddress as Address,
            callData: encodeFunctionData({
              abi: merkle,
              functionName: 'claim',
              args: [BigInt(data.index), address, BigInt(data.amount), data.proof as Hex[]],
            }),
          })),
        ]

        setRequest({
          account: address,
          to: '0x41583e371eC762e3C7443B17093A5748EaF6A644',
          data: encodeFunctionData({ abi: multicallV2, functionName: 'aggregate', args }),
        })
      }
      catch { }
    },
    [address, rewardsData],
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
  }), [estimateGas, isWritePending, request, sendTransaction])
}
