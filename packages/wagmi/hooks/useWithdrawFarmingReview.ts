import type { ParachainId } from '@zenlink-interface/chain'
import { useNotifications } from '@zenlink-interface/shared'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'
import { SendTransactionResult, waitForTransaction } from '@wagmi/core'
import { useAccount, useNetwork } from 'wagmi'
import { BigNumber } from 'ethers'
import type { Amount, Type } from '@zenlink-interface/currency'
import { t } from '@lingui/macro'
import { calculateGasMargin } from '../calculateGasMargin'
import { useSendTransaction } from './useSendTransaction'
import { getFarmingContractConfig, useFarmingContract } from './useFarming'
import { WagmiTransactionRequest } from 'types'
import { encodeFunctionData } from 'viem'

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
  const { address } = useAccount()
  const { chain } = useNetwork()

  const { abi, address: contractAddress } = getFarmingContractConfig(chainId)
  const contract = useFarmingContract(chainId)
  const [, { createNotification }] = useNotifications(address)

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !chainId)
        return
      const ts = new Date().getTime()
      createNotification({
        type: 'burn',
        chainId,
        txHash: data.hash,
        promise: waitForTransaction({ hash: data.hash }),
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

        const methodNames = ['redeem']
        const args: any = [
          pid,
          amountToWithdraw.currency.wrapped.address,
          amountToWithdraw.quotient.toString(),
        ]

        const safeGasEstimates = await Promise.all(
          methodNames.map(methodName =>
            contract.estimateGas[methodName](...args)
              .then(calculateGasMargin)
              .catch(),
          ),
        )

        const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(safeGasEstimate =>
          BigNumber.isBigNumber(safeGasEstimate),
        )

        if (indexOfSuccessfulEstimation !== -1) {
          const methodName = methodNames[indexOfSuccessfulEstimation]
          const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

          setRequest({
            account: address,
            to: contractAddress,
            data: encodeFunctionData({abi, functionName: methodName, args}),
            gas: safeGasEstimate.toBigInt(),
          })
        }
      }
      catch (e: unknown) {
        //
      }
    },
    [pid, contract, chain?.id, address, amountToWithdraw],
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
  })

  return useMemo(() => ({
    isWritePending,
    sendTransaction: sendTransaction as (() => void) | undefined,
    farmAddress: contractAddress,
  }), [contractAddress, isWritePending, sendTransaction])
}
