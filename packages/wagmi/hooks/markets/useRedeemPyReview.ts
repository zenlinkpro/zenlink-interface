import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Token } from '@zenlink-interface/currency'
import { type Dispatch, type SetStateAction, useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import type { SendTransactionData } from 'wagmi/query'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { t } from '@lingui/macro'
import { type Market, getMaturityFormatDate } from '@zenlink-interface/market'
import { Percent, ZERO } from '@zenlink-interface/math'
import type { Address } from 'viem'
import { encodeFunctionData, zeroAddress } from 'viem'
import { calculateSlippageAmount } from '@zenlink-interface/amm'
import { config } from '../../client'
import type { WagmiTransactionRequest } from '../../types'
import { useSendTransaction } from '../useSendTransaction'
import { getMarketActionRouterContract, useMarketActionRouterContract } from './useMarketActionRouter'
import type { TokenOutput } from './types'
import { SwapType } from './types'

interface UseRedeemPyReviewParams {
  chainId: ParachainId
  market: Market
  pyToRedeem: Amount<Token> | undefined
  pyRedeemed: Amount<Token>
  setOpen: Dispatch<SetStateAction<boolean>>
}

type UseRedeemPyReview = (params: UseRedeemPyReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useRedeemPyReview: UseRedeemPyReview = ({
  chainId,
  market,
  pyToRedeem,
  pyRedeemed,
  setOpen,
}) => {
  const { address } = useAccount()

  const [, { createNotification }] = useNotifications(address)
  const { address: contractAddress, abi } = getMarketActionRouterContract(chainId)
  const contract = useMarketActionRouterContract(chainId)
  const [{ slippageTolerance }] = useSettings()

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
          pending: t`Redeeming PY from ${market.SY.yieldToken.symbol} ${getMaturityFormatDate(market)}`,
          completed: t`Successfully redeemed PY from ${market.SY.yieldToken.symbol} ${getMaturityFormatDate(market)}`,
          failed: t`Something went wrong when redeeming PY`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, market],
  )

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<WagmiTransactionRequest | undefined>>) => {
      try {
        if (!pyToRedeem || pyRedeemed.equalTo(ZERO) || !address || !contract)
          return

        const args: [Address, Address, bigint, TokenOutput] = [
          address,
          market.YT.address as Address,
          BigInt(pyToRedeem.quotient.toString()),
          {
            tokenOut: market.SY.yieldToken.address as Address,
            minTokenOut: BigInt(calculateSlippageAmount(pyRedeemed, slippagePercent)[0].toString()),
            tokenRedeemSy: market.SY.yieldToken.address as Address,
            zenlinkSwap: zeroAddress, // TODO: zenlink aggregator
            swapData: {
              swapType: SwapType.NONE,
              executor: zeroAddress,
              route: '0x',
            },
          },
        ]

        setRequest({
          account: address,
          to: contractAddress,
          data: encodeFunctionData({ abi, functionName: 'redeemPyToToken', args }),
        })
      }
      catch (e: unknown) { }
    },
    [pyToRedeem, pyRedeemed, address, contract, market.YT.address, market.SY.yieldToken.address, slippagePercent, contractAddress, abi],
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
      onSuccess: () => setOpen(false),
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
