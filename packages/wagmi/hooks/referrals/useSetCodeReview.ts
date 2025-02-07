import type { Dispatch, SetStateAction } from 'react'
import type { Address } from 'viem'
import type { SendTransactionData } from 'wagmi/query'
import type { WagmiTransactionRequest } from '../../types'
import { t } from '@lingui/core/macro'
import { chainsParachainIdToChainId, isEvmNetwork } from '@zenlink-interface/chain'
import { useNotifications } from '@zenlink-interface/shared'
import stringify from 'fast-json-stable-stringify'
import { log } from 'next-axiom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { encodeFunctionData, isAddress, ProviderRpcError, stringToHex, UserRejectedRequestError, zeroAddress } from 'viem'
import { useAccount, useEstimateGas, useSendTransaction } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { referralStorage } from '../../abis'
import { config } from '../../client'
import { ReferralStorageContractAddresses } from './config'

interface SetCall {
  address: Address
  calldata: Address
}

interface UseSetCodeReviewParams {
  chainId: number | undefined
  open: boolean
  code: string
  setOpen: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string | undefined>>
  onSuccess: () => void
}

type UseSetCodeReview = (params: UseSetCodeReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  referralAddress: string | undefined
}

export const useSetCodeReview: UseSetCodeReview = ({
  chainId,
  code,
  setOpen,
  setError,
  onSuccess,
}) => {
  const ethereumChainId = chainsParachainIdToChainId[chainId && isEvmNetwork(chainId) ? chainId : -1]
  const { address: account } = useAccount()
  const [, { createNotification }] = useNotifications(account)

  const onSettled = useCallback(
    (hash: SendTransactionData | undefined) => {
      if (!code || !chainId || !hash)
        return

      const ts = new Date().getTime()

      waitForTransactionReceipt(config, { chainId, hash })
        .then((tx) => {
          log.info('set code success', {
            transactionHash: tx.transactionHash,
            chainId,
            code,
          })
        })
        .catch((error: unknown) => {
          log.error('set code failure', {
            error: stringify(error),
            chainId,
            code,
          })
        })

      createNotification({
        type: 'setCode',
        chainId,
        txHash: hash,
        promise: waitForTransactionReceipt(config, { chainId, hash }),
        summary: {
          pending: t`Setting referral code (${code})`,
          completed: t`Successfully Setted referral code (${code})`,
          failed: t`Something went wrong when trying to set referral code (${code})`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, code, createNotification],
  )

  const [request, setRequest] = useState<WagmiTransactionRequest>()
  const { data: estimateGas } = useEstimateGas({
    ...request,
    chainId: ethereumChainId,
  })

  const { sendTransaction, isPending: isWritePending } = useSendTransaction({
    mutation: {
      onSettled,
      onSuccess: (data) => {
        if (data) {
          setOpen(false)
          onSuccess()
        }
      },
    },
  })

  const referralContratAddress = useMemo(() => {
    const address = ReferralStorageContractAddresses[chainId ?? -1]
    if (!chainId || !address)
      return undefined
    return address
  }, [chainId])

  const prepare = useCallback(() => {
    if (!code || !account || !chainId || !referralContratAddress)
      return
    try {
      const call: SetCall = {
        address: referralContratAddress,
        calldata: encodeFunctionData({
          abi: referralStorage,
          functionName: 'setReferralCodeByUser',
          args: [stringToHex(code, { size: 32 })],
        }),
      }
      if (!isAddress(call.address))
        throw new Error('call address has to be an address')
      if (call.address === zeroAddress)
        throw new Error('call address cannot be zero')
      const tx = { account, to: call.address, data: call.calldata }

      setRequest({ ...tx })
    }
    catch (e: unknown) {
      if (e instanceof UserRejectedRequestError)
        return
      if (e instanceof ProviderRpcError)
        setError(e.message)

      console.error(e)
    }
  }, [account, chainId, code, referralContratAddress, setError])

  useEffect(() => {
    prepare()
  }, [prepare])

  return useMemo(() => ({
    isWritePending,
    sendTransaction: request && estimateGas
      ? () => sendTransaction({ ...request })
      : undefined,
    referralAddress: referralContratAddress,
  }), [estimateGas, isWritePending, referralContratAddress, request, sendTransaction])
}
