import type { AggregatorTrade } from '@zenlink-interface/amm'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Token, Type } from '@zenlink-interface/currency'
import type { Address } from 'viem'
import type { SendTransactionData } from 'wagmi/query'
import type { WagmiTransactionRequest } from '../../types'
import type { TokenOutput } from './types'
import { t } from '@lingui/core/macro'
import { calculateSlippageAmount, TradeVersion } from '@zenlink-interface/amm'
import { getMaturityFormatDate, type Market } from '@zenlink-interface/market'
import { Percent, ZERO } from '@zenlink-interface/math'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import { type Dispatch, type SetStateAction, useCallback, useMemo } from 'react'
import { encodeFunctionData, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { config } from '../../client'
import { useSendTransaction } from '../useSendTransaction'
import { getSwapRouterContractConfig } from '../useSwapRouter'
import { SwapType } from './types'
import { getMarketActionRouterContract, useMarketActionRouterContract } from './useMarketActionRouter'

interface UseRedeemPyReviewParams {
  chainId: ParachainId
  market: Market
  trade: AggregatorTrade | undefined
  pyToRedeem: Amount<Token> | undefined
  outputAmount: Amount<Type> | undefined
  setOpen: Dispatch<SetStateAction<boolean>>
  onSuccess: () => void
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
  outputAmount,
  setOpen,
  onSuccess,
  trade,
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
          pending: t`Redeeming PY from ${market.SY.yieldToken.symbol || 'symbol'} ${getMaturityFormatDate(market)}`,
          completed: t`Successfully redeemed PY from ${market.SY.yieldToken.symbol || 'symbol'} ${getMaturityFormatDate(market)}`,
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
        if (!pyToRedeem || !outputAmount || outputAmount.equalTo(ZERO) || !address || !contract)
          return

        const tokenOut = outputAmount.currency.isNative
          ? zeroAddress
          : outputAmount.currency.address as Address

        const zenlinkSwap = trade
          ? getSwapRouterContractConfig(market.chainId, TradeVersion.AGGREGATOR).address as Address
          : zeroAddress

        const swapData = trade
          ? {
              swapType: SwapType.ZENLINK,
              executor: trade?.writeArgs[0],
              route: trade?.writeArgs[2],
            }
          : {
              swapType: SwapType.NONE,
              executor: zeroAddress,
              route: '0x',
            }

        const args: [Address, Address, bigint, TokenOutput] = [
          address,
          market.YT.address as Address,
          BigInt(pyToRedeem.quotient.toString()),
          {
            tokenOut,
            minTokenOut: BigInt(calculateSlippageAmount(outputAmount, slippagePercent)[0].toString()),
            tokenRedeemSy: market.SY.yieldToken.address as Address,
            zenlinkSwap,
            swapData,
          },
        ]

        setRequest({
          account: address,
          to: contractAddress,
          data: encodeFunctionData({ abi, functionName: 'redeemPyToToken', args }),
        })
      }
      catch { }
    },
    [pyToRedeem, outputAmount, address, contract, trade, market.chainId, market.YT.address, market.SY.yieldToken.address, slippagePercent, contractAddress, abi],
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
      onSuccess: () => {
        setOpen(false)
        onSuccess()
      },
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
