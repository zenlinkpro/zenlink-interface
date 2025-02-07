import type { ParachainId } from '@zenlink-interface/chain'
import type { Dispatch, SetStateAction } from 'react'
import type { SendTransactionData } from 'wagmi/query'
import type { WagmiTransactionRequest } from '../types'
import { t } from '@lingui/core/macro'
import { useNotifications } from '@zenlink-interface/shared'
import { useCallback, useMemo } from 'react'
import { encodeFunctionData } from 'viem'
import { useAccount } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { config } from '../client'
import { getFarmingContractConfig, useFarmingContract } from './useFarming'
import { useSendTransaction } from './useSendTransaction'

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
  const { address, chain } = useAccount()

  const { abi, address: contractAddress } = getFarmingContractConfig(chainId)
  const contract = useFarmingContract(chainId)
  const [, { createNotification }] = useNotifications(address)

  const onSettled = useCallback(
    (hash: SendTransactionData | undefined) => {
      if (!hash || !chainId)
        return
      const ts = new Date().getTime()
      createNotification({
        type: 'burn',
        chainId,
        txHash: hash,
        promise: waitForTransactionReceipt(config, { hash }),
        summary: {
          pending: t`Claiming Rewards`,
          completed: t`Successfully claimed rewards`,
          failed: t`Something went wrong when claim rewards`,
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
        if (
          !pid
          || !contract
          || !chain?.id
          || !address
        ) {
          return
        }

        setRequest({
          account: address,
          to: contractAddress,
          data: encodeFunctionData({ abi, functionName: 'claim', args: [BigInt(pid)] }),
        })
      }
      catch {
        //
      }
    },
    [pid, contract, chain?.id, address, contractAddress, abi],
  )

  const {
    request,
    estimateGas,
    useSendTransactionReturn: {
      sendTransaction,
      isPending: isWritePending,
    },
  } = useSendTransaction({
    chainId,
    prepare,
    mutation: {
      onSettled,
    },
  })

  return useMemo(() => ({
    isWritePending,
    sendTransaction: request && estimateGas
      ? () => sendTransaction({ ...request })
      : undefined,
    farmAddress: contractAddress,
  }), [contractAddress, estimateGas, isWritePending, request, sendTransaction])
}
