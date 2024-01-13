import type { ParachainId } from '@zenlink-interface/chain'
import { useNotifications } from '@zenlink-interface/shared'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'
import type { Amount, Type } from '@zenlink-interface/currency'
import { t } from '@lingui/macro'
import type { Address } from 'viem'
import { encodeFunctionData } from 'viem'
import type { SendTransactionData } from 'wagmi/query'
import { waitForTransactionReceipt } from 'wagmi/actions'
import type { WagmiTransactionRequest } from '../types'
import { config } from '../client'
import { useSendTransaction } from './useSendTransaction'
import { getFarmingContractConfig, useFarmingContract } from './useFarming'

interface UseWithdrawFarmingReviewParams {
  chainId: ParachainId
  farmAddress?: string
  pid: number
  amountToWithdraw: Amount<Type> | undefined
}

type UseWithdrawFarmingReview = (params: UseWithdrawFarmingReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  farmAddress: string | undefined
}

export const useWithdrawFarmingReview: UseWithdrawFarmingReview = ({
  chainId,
  pid,
  amountToWithdraw,
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
          pending: t`Unstaking ${amountToWithdraw?.toSignificant(6)} ${amountToWithdraw?.currency.symbol}`,
          completed: t`Successfully unstaked ${amountToWithdraw?.toSignificant(6)} ${amountToWithdraw?.currency.symbol}`,
          failed: t`Something went wrong when unstake ${amountToWithdraw?.toSignificant(6)} ${amountToWithdraw?.currency.symbol}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [amountToWithdraw, chainId, createNotification],
  )

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<WagmiTransactionRequest | undefined>>) => {
      try {
        if (
          !pid
          || !contract
          || !chain?.id
          || !address
          || !amountToWithdraw
        )
          return

        const args: [bigint, Address, bigint] = [
          BigInt(pid),
          amountToWithdraw.currency.wrapped.address as Address,
          BigInt(amountToWithdraw.quotient.toString()),
        ]

        setRequest({
          account: address,
          to: contractAddress,
          data: encodeFunctionData({ abi, functionName: 'redeem', args }),
        })
      }
      catch (e: unknown) {
        //
      }
    },
    [pid, contract, chain?.id, address, amountToWithdraw, contractAddress, abi],
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
