import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { Amount } from '@zenlink-interface/currency'
import type { Type } from '@zenlink-interface/currency'
import { Percent } from '@zenlink-interface/math'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import type { SendTransactionResult } from 'wagmi/actions'
import { waitForTransaction } from 'wagmi/actions'
import { calculateSlippageAmount } from '@zenlink-interface/amm'
import { t } from '@lingui/macro'
import { encodeFunctionData } from 'viem'
import { BigNumber } from 'ethers'
import type { WagmiTransactionRequest } from '../types'
import { calculateGasMargin } from '../calculateGasMargin'
import { PairState } from './usePairs'
import { getStandardRouterContractConfig, useStandardRouterContract } from './useStandardRouter'
import { useTransactionDeadline } from './useTransactionDeadline'
import { useSendTransaction } from './useSendTransaction'

interface UseAddLiquidityStandardReviewParams {
  chainId: ParachainId
  poolState: PairState
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  setOpen: Dispatch<SetStateAction<boolean>>
}

type UseAddLiquidityStandardReview = (params: UseAddLiquidityStandardReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useAddLiquidityStandardReview: UseAddLiquidityStandardReview = ({
  chainId,
  token0,
  token1,
  input0,
  input1,
  setOpen,
  poolState,
}) => {
  const ethereumChainId = chainsParachainIdToChainId[chainId ?? -1]
  const { address } = useAccount()
  const deadline = useTransactionDeadline(ethereumChainId)
  const { chain } = useNetwork()

  const [, { createNotification }] = useNotifications(address)
  const { address: contractAddress, abi } = getStandardRouterContractConfig(chainId)
  const contract = useStandardRouterContract(chainId)
  const [{ slippageTolerance }] = useSettings()

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !token0 || !token1)
        return

      const ts = new Date().getTime()
      createNotification({
        type: 'mint',
        chainId,
        txHash: data.hash,
        promise: waitForTransaction({ hash: data.hash }),
        summary: {
          pending: t`Adding liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          completed: t`Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          failed: t`Something went wrong when adding liquidity`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, token0, token1],
  )

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      input0
        ? poolState === PairState.NOT_EXISTS
          ? input0
          : Amount.fromRawAmount(input0.currency, calculateSlippageAmount(input0, slippagePercent)[0])
        : undefined,
      input1
        ? poolState === PairState.NOT_EXISTS
          ? input1
          : Amount.fromRawAmount(input1.currency, calculateSlippageAmount(input1, slippagePercent)[0])
        : undefined,
    ]
  }, [poolState, input0, input1, slippagePercent])

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<WagmiTransactionRequest | undefined>>) => {
      try {
        if (
          !token0
          || !token1
          || !chain?.id
          || !contract
          || !input0
          || !input1
          || !address
          || !minAmount0
          || !minAmount1
          || !deadline
        )
          return
        const withNative = token0.isNative || token1.isNative

        if (withNative) {
          const value = (token1.isNative ? input1 : input0).quotient.toString()
          const args = [
            (token1.isNative ? token0 : token1).wrapped.address,
            (token1.isNative ? input0 : input1).quotient.toString(),
            (token1.isNative ? minAmount0 : minAmount1).quotient.toString(),
            (token1.isNative ? minAmount1 : minAmount0).quotient.toString(),
            address,
            deadline.toHexString(),
          ]
          const gasLimit = await contract.estimateGas.addLiquidityNativeCurrency([...args, { value }])

          setRequest({
            account: address,
            to: contractAddress,
            data: encodeFunctionData({ abi, functionName: 'addLiquidityNativeCurrency', args }),
            value: BigNumber.from(value).toBigInt(),
            gas: calculateGasMargin(BigNumber.from(gasLimit)).toBigInt(),
          })
        }
        else {
          const args = [
            token0.wrapped.address,
            token1.wrapped.address,
            input0.quotient.toString(),
            input1.quotient.toString(),
            minAmount0.quotient.toString(),
            minAmount1.quotient.toString(),
            address,
            deadline.toHexString(),
          ]

          const gasLimit = await contract.estimateGas.addLiquidity([...args, {}])
          setRequest({
            account: address,
            to: contractAddress,
            data: encodeFunctionData({ abi, functionName: 'addLiquidity', args }),
            gas: calculateGasMargin(BigNumber.from(gasLimit)).toBigInt(),
          })
        }
      }
      catch (e: unknown) { }
    },
    [token0, token1, chain?.id, contract, input0, input1, address, minAmount0, minAmount1, deadline, contractAddress, abi],
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess: () => setOpen(false),
  })

  return useMemo(() => ({
    isWritePending,
    sendTransaction: sendTransaction as (() => void) | undefined,
    routerAddress: contractAddress,
  }), [contractAddress, isWritePending, sendTransaction])
}
