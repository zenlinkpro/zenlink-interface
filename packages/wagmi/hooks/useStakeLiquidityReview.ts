import type { ParachainId } from '@zenlink-interface/chain'
import { useNotifications } from '@zenlink-interface/shared'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'
import type { Address, SendTransactionResult } from '@wagmi/core'
import { waitForTransaction } from '@wagmi/core'
import { useAccount, useNetwork } from 'wagmi'
import { BigNumber } from 'ethers'
import type { Amount, Type } from '@zenlink-interface/currency'
import { t } from '@lingui/macro'
import { encodeFunctionData } from 'viem'
import { calculateGasMargin } from '../calculateGasMargin'
import type { WagmiTransactionRequest } from '../types'
import { useSendTransaction } from './useSendTransaction'
import { getFarmingContractConfig, useFarmingContract } from './useFarming'

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
    async (setRequest: Dispatch<SetStateAction<WagmiTransactionRequest | undefined>>) => {
      try {
        if (
          !pid
          || !contract
          || !chain?.id
          || !address
          || !amountToStake
        )
          return

        const args: [bigint, Address, bigint] = [
          BigInt(pid),
          amountToStake.currency.wrapped.address as Address,
          BigInt(amountToStake.quotient.toString()),
        ]

        const safeGasEstimate = await contract.estimateGas.stake(args)
          .then(value => calculateGasMargin(BigNumber.from(value)))
          .catch(() => undefined)

        if (safeGasEstimate) {
          setRequest({
            account: address,
            to: contractAddress,
            data: encodeFunctionData({ abi, functionName: 'stake', args }),
            gas: safeGasEstimate.toBigInt(),
          })
        }
      }
      catch (e: unknown) {
        //
      }
    },
    [pid, contract, chain?.id, address, amountToStake, contractAddress, abi],
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
