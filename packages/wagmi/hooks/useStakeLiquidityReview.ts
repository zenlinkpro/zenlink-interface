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

interface UseStakeLiquidityReviewParams {
  chainId: ParachainId
  farmAddress?: string
  pid: number
  amountToStake: Amount<Type> | undefined
}

type UseStakeLiquidityReview = (params: UseStakeLiquidityReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  farmAddress: string | undefined
}

export const useStakeLiquidityReview: UseStakeLiquidityReview = ({
  chainId,
  pid,
  amountToStake,
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
          pending: t`Staking ${amountToStake?.toSignificant(6)} ${amountToStake?.currency.symbol}`,
          completed: t`Successfully stake ${amountToStake?.toSignificant(6)} ${amountToStake?.currency.symbol}`,
          failed: t`Something went wrong when stake ${amountToStake?.toSignificant(6)} ${amountToStake?.currency.symbol}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [amountToStake, chainId, createNotification],
  )

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      try {
        if (
          !pid
          || !contract
          || !chain?.id
          || !address
          || !amountToStake
        )
          return

        const methodNames = ['stake']
        const args: any = [
          pid,
          amountToStake.currency.wrapped.address,
          amountToStake.quotient.toString(),
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
    [pid, contract, chain?.id, address, amountToStake],
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
