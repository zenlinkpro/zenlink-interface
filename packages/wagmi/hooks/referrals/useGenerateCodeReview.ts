import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useNotifications } from '@zenlink-interface/shared'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useAccount,
  usePrepareSendTransaction,
  usePublicClient,
  useSendTransaction,
} from 'wagmi'
import type { SendTransactionResult } from '@wagmi/core'
import { waitForTransaction } from 'wagmi/actions'
import { log } from 'next-axiom'
import stringify from 'fast-json-stable-stringify'
import { BaseContract, BigNumber } from 'ethers'
import { formatBytes32String, isAddress } from 'ethers/lib/utils.js'
import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import type { Address } from 'viem'
import { ProviderRpcError, UserRejectedRequestError } from 'viem'
import { referralStorage } from '../../abis'
import { calculateGasMargin } from '../../calculateGasMargin'
import type { WagmiTransactionRequest } from '../../types'
import { ReferralStorageContractAddresses } from './config'

interface GenerateCall {
  address: string
  calldata: string
}

interface UseGenerateCodeReviewParams {
  chainId: number | undefined
  open: boolean
  code: string
  setOpen: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string | undefined>>
  onSuccess(): void
}

type UseGenerateCodeReview = (params: UseGenerateCodeReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  referralAddress: string | undefined
}

export const useGenerateCodeReview: UseGenerateCodeReview = ({
  chainId,
  code,
  setOpen,
  setError,
  onSuccess,
}) => {
  const ethereumChainId = chainsParachainIdToChainId[chainId ?? -1]
  const { address: account } = useAccount()
  const provider = usePublicClient({ chainId: ethereumChainId })
  const [, { createNotification }] = useNotifications(account)

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!code || !chainId || !data)
        return

      const ts = new Date().getTime()

      waitForTransaction({ hash: data.hash })
        .then((tx) => {
          log.info('generate code success', {
            transactionHash: tx.transactionHash,
            chainId,
            code,
          })
        })
        .catch((error: unknown) => {
          log.error('generate code failure', {
            error: stringify(error),
            chainId,
            code,
          })
        })

      createNotification({
        type: 'generateCode',
        chainId,
        txHash: data.hash,
        promise: waitForTransaction({ hash: data.hash }),
        summary: {
          pending: t`Generating referral code (${code})`,
          completed: t`Successfully Generated referral code (${code})`,
          failed: t`Something went wrong when trying to generate referral code (${code})`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, code, createNotification],
  )

  const [request, setRequest] = useState<WagmiTransactionRequest>()
  const { config } = usePrepareSendTransaction({
    ...request,
    chainId: ethereumChainId,
    enabled: !!code && !!request,
  })

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    ...config,
    onSettled,
    onSuccess: (data) => {
      if (data) {
        setOpen(false)
        onSuccess()
      }
    },
  })

  const referralContrat = useMemo(() => {
    const address = ReferralStorageContractAddresses[chainId ?? -1]
    if (!chainId || !address)
      return undefined
    return new BaseContract(
      address,
      referralStorage,
    )
  }, [chainId])

  const prepare = useCallback(async () => {
    if (!code || !account || !chainId)
      return
    try {
      let call: GenerateCall | null = null
      if (referralContrat) {
        call = {
          address: referralContrat.address,
          calldata: referralContrat.interface.encodeFunctionData(
            'registerCode',
            [formatBytes32String(code)],
          ),
        }
      }
      if (call) {
        if (!isAddress(call.address))
          throw new Error('call address has to be an address')
        if (call.address === AddressZero)
          throw new Error('call address cannot be zero')

        const tx = { account, to: call.address as Address, data: call.calldata as Address }

        const estimatedCall = await provider
          .estimateGas(tx)
          .then((gasEstimate) => {
            return {
              call,
              gasEstimate,
            }
          })
          .catch(() => {
            return provider
              .call(tx)
              .then(() => {
                return {
                  call,
                  error: new Error('Unexpected issue with estimating the gas. Please try again.'),
                }
              })
              .catch((callError) => {
                return {
                  call,
                  error: new Error(callError),
                }
              })
          })

        setRequest({
          ...tx,
          ...(
            'gasEstimate' in estimatedCall
              ? { gasLimit: calculateGasMargin(BigNumber.from(estimatedCall.gasEstimate)) }
              : {}
          ),
        })
      }
    }
    catch (e: unknown) {
      if (e instanceof UserRejectedRequestError)
        return
      if (e instanceof ProviderRpcError)
        setError(e.message)

      console.error(e)
    }
  }, [account, chainId, code, provider, referralContrat, setError])

  useEffect(() => {
    prepare()
  }, [prepare])

  return useMemo(() => ({
    isWritePending,
    sendTransaction: sendTransaction as (() => void) | undefined,
    referralAddress: referralContrat?.address,
  }), [isWritePending, referralContrat?.address, sendTransaction])
}
