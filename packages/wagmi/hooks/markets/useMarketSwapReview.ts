import { type Market, type Trade, TradeType } from '@zenlink-interface/market'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import { type Dispatch, type SetStateAction, useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import type { SendTransactionData } from 'wagmi/query'
import { t } from '@lingui/macro'
import { MAX_UINT256, Percent } from '@zenlink-interface/math'
import type { Address } from 'viem'
import { encodeFunctionData, zeroAddress } from 'viem'
import { calculateSlippageAmount } from '@zenlink-interface/amm'
import { config } from '../../client'
import type { WagmiTransactionRequest } from '../../types'
import { useSendTransaction } from '../useSendTransaction'
import { getMarketActionRouterContract, useMarketActionRouterContract } from './useMarketActionRouter'
import { type ApproxParams, type LimitOrderData, SwapType, type TokenInput, type TokenOutput } from './types'

interface UseMarketSwapReviewParams {
  chainId: number | undefined
  trade: Trade | undefined
  market: Market
  setOpen: Dispatch<SetStateAction<boolean>>
  onSuccess: () => void
}

type UseMarketSwapReview = (params: UseMarketSwapReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useMarketSwapReview: UseMarketSwapReview = ({
  chainId,
  trade,
  setOpen,
  onSuccess,
  market,
}) => {
  const { address: account } = useAccount()
  const [, { createNotification }] = useNotifications(account)

  const { address: contractAddress, abi } = getMarketActionRouterContract(chainId)
  const contract = useMarketActionRouterContract(chainId)
  const [{ slippageTolerance }] = useSettings()

  const onSettled = useCallback(
    async (hash: SendTransactionData | undefined) => {
      if (!trade || !chainId || !hash)
        return

      const ts = new Date().getTime()

      createNotification({
        type: 'swap',
        chainId,
        txHash: hash,
        promise: waitForTransactionReceipt(config, { hash }),
        summary: {
          pending: t`Swapping ${trade.inputAmount.toSignificant(6)} ${trade.inputAmount.currency.symbol} 
            for ${trade.outputAmount.toSignificant(6)} ${trade.outputAmount.currency.symbol}`,
          completed: t`Successfully swapped ${trade.inputAmount.toSignificant(6)} ${trade.inputAmount.currency.symbol}
            for ${trade.outputAmount.toSignificant(6)} ${trade.outputAmount.currency.symbol}`,
          failed: t`Something went wrong when trying to swap ${trade.inputAmount.currency.symbol} 
            for ${trade.outputAmount.currency.symbol}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, trade],
  )

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<WagmiTransactionRequest | undefined>>) => {
      try {
        if (!trade || !account || !contract)
          return

        switch (trade.tradeType) {
          case TradeType.EXACT_PT_FOR_TOKEN: {
            const args: [Address, Address, bigint, TokenOutput, LimitOrderData] = [
              account,
              market.address as Address,
              BigInt(trade.inputAmount.quotient.toString()),
              {
                tokenOut: market.SY.yieldToken.address as Address,
                minTokenOut: BigInt(calculateSlippageAmount(trade.outputAmount, slippagePercent)[0].toString()),
                tokenRedeemSy: market.SY.yieldToken.address as Address,
                zenlinkSwap: zeroAddress,
                swapData: {
                  swapType: SwapType.NONE,
                  executor: zeroAddress,
                  route: '0x',
                },
              },
              {
                limitRouter: zeroAddress,
                epsSkipMarket: BigInt(0),
                normalFills: [],
                flashFills: [],
                optData: '0x',
              },
            ]

            setRequest({
              account,
              to: contractAddress,
              data: encodeFunctionData({ abi, functionName: 'swapExactPtForToken', args }),
            })
            break
          }
          case TradeType.EXACT_PT_FOR_YT: {
            const args: [Address, Address, bigint, bigint, ApproxParams] = [
              account,
              market.address as Address,
              BigInt(trade.inputAmount.quotient.toString()),
              BigInt(calculateSlippageAmount(trade.outputAmount, slippagePercent)[0].toString()),
              {
                guessMin: BigInt(0),
                guessMax: BigInt(MAX_UINT256.toString()),
                guessOffchain: trade.guessOffChain ? BigInt(trade.guessOffChain.toString()) : BigInt(0),
                maxIteration: BigInt(256),
                eps: BigInt(1e15),
              },
            ]

            setRequest({
              account,
              to: contractAddress,
              data: encodeFunctionData({ abi, functionName: 'swapExactPtForYt', args }),
            })
            break
          }
          case TradeType.EXACT_YT_FOR_TOKEN: {
            const args: [Address, Address, bigint, TokenOutput, LimitOrderData] = [
              account,
              market.address as Address,
              BigInt(trade.inputAmount.quotient.toString()),
              {
                tokenOut: market.SY.yieldToken.address as Address,
                minTokenOut: BigInt(calculateSlippageAmount(trade.outputAmount, slippagePercent)[0].toString()),
                tokenRedeemSy: market.SY.yieldToken.address as Address,
                zenlinkSwap: zeroAddress,
                swapData: {
                  swapType: SwapType.NONE,
                  executor: zeroAddress,
                  route: '0x',
                },
              },
              {
                limitRouter: zeroAddress,
                epsSkipMarket: BigInt(0),
                normalFills: [],
                flashFills: [],
                optData: '0x',
              },
            ]

            setRequest({
              account,
              to: contractAddress,
              data: encodeFunctionData({ abi, functionName: 'swapExactYtForToken', args }),
            })
            break
          }
          case TradeType.EXACT_YT_FOR_PT: {
            const args: [Address, Address, bigint, bigint, ApproxParams] = [
              account,
              market.address as Address,
              BigInt(trade.inputAmount.quotient.toString()),
              BigInt(calculateSlippageAmount(trade.outputAmount, slippagePercent)[0].toString()),
              {
                guessMin: BigInt(0),
                guessMax: BigInt(MAX_UINT256.toString()),
                guessOffchain: trade.guessOffChain ? BigInt(trade.guessOffChain.toString()) : BigInt(0),
                maxIteration: BigInt(256),
                eps: BigInt(1e15),
              },
            ]

            setRequest({
              account,
              to: contractAddress,
              data: encodeFunctionData({ abi, functionName: 'swapExactYtForPt', args }),
            })
            break
          }
          case TradeType.EXACT_TOKEN_FOR_PT: {
            const args: [Address, Address, bigint, ApproxParams, TokenInput, LimitOrderData] = [
              account,
              market.address as Address,
              BigInt(calculateSlippageAmount(trade.outputAmount, slippagePercent)[0].toString()),
              {
                guessMin: BigInt(0),
                guessMax: BigInt(MAX_UINT256.toString()),
                guessOffchain: trade.guessOffChain ? BigInt(trade.guessOffChain.toString()) : BigInt(0),
                maxIteration: BigInt(256),
                eps: BigInt(1e15),
              },
              {
                tokenIn: trade.inputAmount.currency.wrapped.address as Address,
                netTokenIn: BigInt(trade.inputAmount.quotient.toString()),
                tokenMintSy: market.SY.yieldToken.address as Address,
                zenlinkSwap: zeroAddress, // TODO: zenlink aggregator
                swapData: {
                  swapType: SwapType.NONE,
                  executor: zeroAddress,
                  route: '0x',
                },
              },
              {
                limitRouter: zeroAddress,
                epsSkipMarket: BigInt(0),
                normalFills: [],
                flashFills: [],
                optData: '0x',
              },
            ]

            setRequest({
              account,
              to: contractAddress,
              data: encodeFunctionData({ abi, functionName: 'swapExactTokenForPt', args }),
            })
            break
          }
          case TradeType.EXACT_TOKEN_FOR_YT: {
            const args: [Address, Address, bigint, ApproxParams, TokenInput, LimitOrderData] = [
              account,
              market.address as Address,
              BigInt(calculateSlippageAmount(trade.outputAmount, slippagePercent)[0].toString()),
              {
                guessMin: BigInt(0),
                guessMax: BigInt(MAX_UINT256.toString()),
                guessOffchain: trade.guessOffChain ? BigInt(trade.guessOffChain.toString()) : BigInt(0),
                maxIteration: BigInt(256),
                eps: BigInt(1e15),
              },
              {
                tokenIn: trade.inputAmount.currency.wrapped.address as Address,
                netTokenIn: BigInt(trade.inputAmount.quotient.toString()),
                tokenMintSy: market.SY.yieldToken.address as Address,
                zenlinkSwap: zeroAddress, // TODO: zenlink aggregator
                swapData: {
                  swapType: SwapType.NONE,
                  executor: zeroAddress,
                  route: '0x',
                },
              },
              {
                limitRouter: zeroAddress,
                epsSkipMarket: BigInt(0),
                normalFills: [],
                flashFills: [],
                optData: '0x',
              },
            ]

            setRequest({
              account,
              to: contractAddress,
              data: encodeFunctionData({ abi, functionName: 'swapExactTokenForYt', args }),
            })
            break
          }
        }
      }
      catch { }
    },
    [abi, account, contract, contractAddress, market.SY.yieldToken.address, market.address, slippagePercent, trade],
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
