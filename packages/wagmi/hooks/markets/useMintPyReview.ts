import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Token, Type } from '@zenlink-interface/currency'
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
import type { AggregatorTrade } from '@zenlink-interface/amm'
import { TradeVersion, calculateSlippageAmount } from '@zenlink-interface/amm'
import { config } from '../../client'
import type { WagmiTransactionRequest } from '../../types'
import { useSendTransaction } from '../useSendTransaction'
import { getSwapRouterContractConfig } from '../useSwapRouter'
import { getMarketActionRouterContract, useMarketActionRouterContract } from './useMarketActionRouter'
import { SwapType, type TokenInput } from './types'

interface UseMintPyReviewParams {
  chainId: ParachainId
  market: Market
  trade: AggregatorTrade | undefined
  amountSpecified: Amount<Type> | undefined
  ptMinted: Amount<Token>
  ytMinted: Amount<Token>
  setOpen: Dispatch<SetStateAction<boolean>>
  onSuccess: () => void
}

type UseMintPyReview = (params: UseMintPyReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useMintPyReview: UseMintPyReview = ({
  chainId,
  market,
  amountSpecified,
  trade,
  ptMinted,
  ytMinted,
  setOpen,
  onSuccess,
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
        type: 'mint',
        chainId,
        txHash: hash,
        promise: waitForTransactionReceipt(config, { hash }),
        summary: {
          pending: t`Minting PY from ${market.SY.yieldToken.symbol} ${getMaturityFormatDate(market)}`,
          completed: t`Successfully minted PY from ${market.SY.yieldToken.symbol} ${getMaturityFormatDate(market)}`,
          failed: t`Something went wrong when minting PY`,
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
        if (!amountSpecified || ptMinted.equalTo(ZERO) || ytMinted.equalTo(ZERO) || !address || !contract)
          return

        const isMintFromSy = amountSpecified.currency.equals(market.SY)

        if (isMintFromSy) {
          const args: [Address, Address, bigint, bigint] = [
            address,
            market.YT.address as Address,
            BigInt(amountSpecified.quotient.toString()),
            BigInt(calculateSlippageAmount(ptMinted, slippagePercent)[0].toString()),
          ]

          setRequest({
            account: address,
            to: contractAddress,
            data: encodeFunctionData({ abi, functionName: 'mintPyFromSy', args }),
          })
        }
        else if (!trade && !amountSpecified.currency.isNative) {
          const args: [Address, Address, bigint, TokenInput] = [
            address,
            market.YT.address as Address,
            BigInt(calculateSlippageAmount(ptMinted, slippagePercent)[0].toString()),
            {
              tokenIn: amountSpecified.currency.address as Address,
              netTokenIn: BigInt(amountSpecified.quotient.toString()),
              tokenMintSy: market.SY.yieldToken.address as Address,
              zenlinkSwap: zeroAddress,
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
            data: encodeFunctionData({ abi, functionName: 'mintPyFromToken', args }),
          })
        }
        else {
          const isNative = amountSpecified.currency.isNative

          const args: [Address, Address, bigint, TokenInput] = [
            address,
            market.YT.address as Address,
            BigInt(calculateSlippageAmount(ptMinted, slippagePercent)[0].toString()),
            {
              tokenIn: isNative ? zeroAddress : amountSpecified.currency.address as Address,
              netTokenIn: BigInt(amountSpecified.quotient.toString()),
              tokenMintSy: market.SY.yieldToken.address as Address,
              zenlinkSwap: getSwapRouterContractConfig(market.chainId, TradeVersion.AGGREGATOR).address as Address,
              swapData: {
                swapType: SwapType.ZENLINK,
                executor: trade?.writeArgs[0],
                route: trade?.writeArgs[2],
              },
            },
          ]

          setRequest({
            account: address,
            to: contractAddress,
            data: encodeFunctionData({ abi, functionName: 'mintPyFromToken', args }),
            value: isNative ? BigInt(amountSpecified.quotient.toString()) : BigInt(0),
          })
        }
      }
      catch (e: unknown) { }
    },
    [amountSpecified, ptMinted, ytMinted, address, contract, market.SY, market.YT.address, market.chainId, trade, slippagePercent, contractAddress, abi],
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
