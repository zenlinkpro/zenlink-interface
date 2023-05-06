import type { ParachainId } from '@zenlink-interface/chain'
import { useNotifications } from '@zenlink-interface/shared'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'
import type { SendTransactionResult } from '@wagmi/core'
import { useAccount, useNetwork } from 'wagmi'
import type { TransactionRequest } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import type { Amount, Type } from '@zenlink-interface/currency'
import { t } from '@lingui/macro'
import { calculateGasMargin } from '../calculateGasMargin'
import { useSendTransaction } from './useSendTransaction'
import { useFarmingContract } from './useFarming'

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
        promise: data.wait(),
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
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
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
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData(methodName, args),
            gasLimit: safeGasEstimate,
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
    farmAddress: contract?.address,
  }), [contract?.address, isWritePending, sendTransaction])
}
