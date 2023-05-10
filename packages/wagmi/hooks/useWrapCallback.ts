import type { TransactionRequest } from '@ethersproject/providers'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Type } from '@zenlink-interface/currency'
import { ZERO } from '@zenlink-interface/math'
import type { NotificationData } from '@zenlink-interface/ui'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { SendTransactionResult, waitForTransaction } from 'wagmi/actions'

import { useSendTransaction } from './useSendTransaction'
import { getWNATIVEContractConfig, useWNATIVEContract } from './useWNATIVEContract'
import { encodeFunctionData } from 'viem'

export enum WrapType {
  Wrap = 'Wrap',
  Unwrap = 'Unwrap',
}

interface UseWrapCallbackParams {
  chainId: ParachainId | undefined
  wrapType: WrapType
  onSuccess?(data: NotificationData): void
  amount: Amount<Type> | undefined
}

type UseWrapCallback = (params: UseWrapCallbackParams) => ReturnType<typeof useSendTransaction>

export const useWrapCallback: UseWrapCallback = ({ chainId, wrapType, amount, onSuccess }) => {
  const { address } = useAccount()
  const { abi, address: contractAddress } = getWNATIVEContractConfig(chainId)
  const contract = useWNATIVEContract(chainId)

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (data && onSuccess && amount && chainId) {
        const ts = new Date().getTime()
        onSuccess({
          type: wrapType === WrapType.Wrap ? 'enterBar' : 'leaveBar',
          chainId,
          txHash: data.hash,
          promise: waitForTransaction({ hash: data.hash }),
          summary: {
            pending: `${wrapType === WrapType.Wrap ? 'Wrapping' : 'Unwrapping'} ${amount.toSignificant(6)} ${amount.currency.symbol
              }`,
            completed: `Successfully ${wrapType === WrapType.Wrap ? 'wrapped' : 'unwrapped'} ${amount.toSignificant(
              6,
            )} ${amount.currency.symbol}`,
            failed: `Something went wrong when trying to ${wrapType === WrapType.Wrap ? 'wrap' : 'unwrap'}`,
          },
          groupTimestamp: ts,
          timestamp: ts,
        })
      }
    },
    [amount, chainId, onSuccess, wrapType],
  )

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<TransactionRequest & { to: string } | undefined>>) => {
      if (!contract || !chainId || !address || !amount || !amount.greaterThan(ZERO))
        return

      if (wrapType === WrapType.Wrap) {
        setRequest({
          from: address,
          to: contractAddress,
          data: encodeFunctionData({ abi, functionName: 'deposit' }),
          value: amount.quotient.toString(),
        })
      }

      if (wrapType === WrapType.Unwrap) {
        setRequest({
          from: address,
          to: contractAddress,
          data: encodeFunctionData({ abi, functionName: 'withdraw', args: [amount.quotient.toString()] }),
        })
      }
    },
    [address, amount, chainId, contract, wrapType],
  )

  return useSendTransaction({
    chainId,
    prepare,
    onSettled,
    enabled: (contract && chainId && address && amount && amount?.greaterThan(ZERO)) ?? undefined,
  })
}
