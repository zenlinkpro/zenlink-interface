import type { ParachainId } from '@zenlink-interface/chain'
import { useNotifications } from '@zenlink-interface/shared'
import { type Dispatch, type SetStateAction, useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'
import type { SendTransactionData } from 'wagmi/query'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { t } from '@lingui/macro'
import type { Address } from 'viem'
import { encodeFunctionData } from 'viem'
import type { JSBI } from '@zenlink-interface/math'
import { config } from '../../client'
import type { WagmiTransactionRequest } from '../../types'
import { useSendTransaction } from '../useSendTransaction'
import { votingController } from '../../abis'
import { votingControllerContract } from './config'

interface UseVoteReviewParams {
  chainId: ParachainId
  markets: Address[]
  weights: JSBI[]
}

type UseVoteReview = (params: UseVoteReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  veAddress: string | undefined
}

export const useVoteReview: UseVoteReview = ({ chainId, markets, weights }) => {
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)
  const contractAddress = votingControllerContract[chainId ?? -1]

  const onSettled = useCallback(
    (hash: SendTransactionData | undefined) => {
      if (!hash)
        return

      const ts = new Date().getTime()
      createNotification({
        type: 'mint',
        chainId,
        txHash: hash,
        promise: waitForTransactionReceipt(config, { hash }),
        summary: {
          pending: t`Voting for the selected markets`,
          completed: t`Successfully voted for the selected markets`,
          failed: t`Something went wrong when voting for the selected markets`,
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

        const args: [Address[], bigint[]] = [
          markets,
          weights.map(weight => BigInt(weight.toString())),
        ]

        setRequest({
          account: address,
          to: contractAddress,
          data: encodeFunctionData({ abi: votingController, functionName: 'vote', args }),
        })
      }
      catch (e: unknown) { }
    },
    [address, contractAddress, markets, weights],
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
