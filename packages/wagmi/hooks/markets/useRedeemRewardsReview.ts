import type { ParachainId } from '@zenlink-interface/chain'
import type { Token } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import type { Dispatch, SetStateAction } from 'react'
import type { Address } from 'viem'
import type { SendTransactionData } from 'wagmi/query'
import type { WagmiTransactionRequest } from '../../types'
import { t } from '@lingui/core/macro'
import { useNotifications } from '@zenlink-interface/shared'
import { useCallback, useMemo } from 'react'
import { encodeFunctionData } from 'viem'
import { useAccount } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { config } from '../../client'
import { useSendTransaction } from '../useSendTransaction'
import { getMarketActionRouterContract, useMarketActionRouterContract } from './useMarketActionRouter'

interface UseRedeemRewardsReviewParams {
  chainId: ParachainId
  sys?: Token[]
  yts?: Token[]
  markets?: Market[]
  setOpen?: Dispatch<SetStateAction<boolean>>
}

type UseRedeemRewardsReview = (params: UseRedeemRewardsReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useRedeemRewardsReview: UseRedeemRewardsReview = ({
  chainId,
  sys,
  yts,
  markets,
  setOpen,
}) => {
  const { address } = useAccount()

  const [, { createNotification }] = useNotifications(address)
  const { address: contractAddress, abi } = getMarketActionRouterContract(chainId)
  const contract = useMarketActionRouterContract(chainId)

  const onSettled = useCallback(
    (hash: SendTransactionData | undefined) => {
      if (!hash)
        return

      const ts = new Date().getTime()
      createNotification({
        type: 'burn',
        chainId,
        txHash: hash,
        promise: waitForTransactionReceipt(config, { hash }),
        summary: {
          pending: t`Redeeming interest and rewards`,
          completed: t`Successfully redeemed PY interest and rewards`,
          failed: t`Something went wrong when redeeming interest and rewards`,
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
        if (!address || !contract)
          return

        const args: [Address, Address[], Address[], Address[]] = [
          address,
          sys?.map(sy => sy.address as Address) || [],
          yts?.map(yt => yt.address as Address) || [],
          markets?.map(market => market.address as Address) || [],
        ]

        setRequest({
          account: address,
          to: contractAddress,
          data: encodeFunctionData({ abi, functionName: 'redeemDueInterestAndRewards', args }),
        })
      }
      catch { }
    },
    [address, contract, sys, yts, markets, contractAddress, abi],
  )

  const {
    estimateGas,
    request,
    useSendTransactionReturn: {
      sendTransaction,
      isPending: isWritePending,
    },
  } = useSendTransaction({
    mutation: {
      onSettled,
      onSuccess: () => setOpen?.(false),
    },
    chainId,
    prepare,
  })

  return useMemo(() => ({
    isWritePending,
    sendTransaction: request && estimateGas
      ? () => sendTransaction({ ...request })
      : undefined,
    routerAddress: contractAddress,
  }), [contractAddress, estimateGas, isWritePending, request, sendTransaction])
}
