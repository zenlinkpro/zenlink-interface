import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Token, Type } from '@zenlink-interface/currency'
import type { Address } from 'viem'
import type { SendTransactionData } from 'wagmi/query'
import type { WagmiTransactionRequest } from '../../types'
import type { ApproxParams, LimitOrderData, TokenInput } from './types'
import { t } from '@lingui/macro'
import { type AggregatorTrade, calculateSlippageAmount, TradeVersion } from '@zenlink-interface/amm'
import { getMaturityFormatDate, type Market } from '@zenlink-interface/market'
import { type JSBI, MAX_UINT256, Percent, ZERO } from '@zenlink-interface/math'
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

interface UseAddZapReviewParams {
  chainId: ParachainId
  market: Market
  trade: AggregatorTrade | undefined
  zeroPriceImpactMode: boolean
  amountSpecified: Amount<Type> | undefined
  lpMinted: Amount<Token>
  ytMinted: Amount<Token>
  guess: JSBI
  setOpen: Dispatch<SetStateAction<boolean>>
  onSuccess: () => void
}

type UseAddZapReview = (params: UseAddZapReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useAddZapReview: UseAddZapReview = ({
  chainId,
  market,
  trade,
  zeroPriceImpactMode,
  amountSpecified,
  ytMinted,
  lpMinted,
  guess,
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
          pending: t`Adding liquidity to the ${market.SY.yieldToken.symbol} ${getMaturityFormatDate(market)} market`,
          completed: t`Successfully added liquidity to the ${market.SY.yieldToken.symbol} ${getMaturityFormatDate(market)} market`,
          failed: t`Something went wrong when adding liquidity`,
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
        if (!amountSpecified || lpMinted.equalTo(ZERO) || !address || !contract)
          return

        const isNative = amountSpecified.currency.isNative

        if (zeroPriceImpactMode) {
          const args: [Address, Address, bigint, bigint, TokenInput] = [
            address,
            market.address as Address,
            BigInt(calculateSlippageAmount(lpMinted, slippagePercent)[0].toString()),
            BigInt(calculateSlippageAmount(ytMinted, slippagePercent)[0].toString()),
            {
              tokenIn: isNative ? zeroAddress : amountSpecified.currency.address as Address,
              netTokenIn: BigInt(amountSpecified.quotient.toString()),
              tokenMintSy: market.SY.yieldToken.address as Address,
              zenlinkSwap: trade
                ? getSwapRouterContractConfig(market.chainId, TradeVersion.AGGREGATOR).address as Address
                : zeroAddress,
              swapData: trade
                ? {
                    swapType: SwapType.ZENLINK,
                    executor: trade.writeArgs[0],
                    route: trade.writeArgs[2],
                  }
                : {
                    swapType: SwapType.NONE,
                    executor: zeroAddress,
                    route: '0x',
                  },
            },
          ]

          setRequest({
            account: address,
            to: contractAddress,
            data: encodeFunctionData({ abi, functionName: 'addLiquiditySingleTokenKeepYt', args }),
            value: isNative ? BigInt(amountSpecified.quotient.toString()) : BigInt(0),
          })
        }
        else {
          const args: [Address, Address, bigint, ApproxParams, TokenInput, LimitOrderData] = [
            address,
            market.address as Address,
            BigInt(calculateSlippageAmount(lpMinted, slippagePercent)[0].toString()),
            {
              guessMin: BigInt(0),
              guessMax: BigInt(MAX_UINT256.toString()),
              guessOffchain: BigInt(guess.toString()),
              maxIteration: BigInt(256),
              eps: BigInt(1e15),
            },
            {
              tokenIn: isNative ? zeroAddress : amountSpecified.currency.address as Address,
              netTokenIn: BigInt(amountSpecified.quotient.toString()),
              tokenMintSy: market.SY.yieldToken.address as Address,
              zenlinkSwap: trade
                ? getSwapRouterContractConfig(market.chainId, TradeVersion.AGGREGATOR).address as Address
                : zeroAddress,
              swapData: trade
                ? {
                    swapType: SwapType.ZENLINK,
                    executor: trade.writeArgs[0],
                    route: trade.writeArgs[2],
                  }
                : {
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
            account: address,
            to: contractAddress,
            data: encodeFunctionData({ abi, functionName: 'addLiquiditySingleToken', args }),
            value: isNative ? BigInt(amountSpecified.quotient.toString()) : BigInt(0),
          })
        }
      }
      catch { }
    },
    [abi, address, amountSpecified, contract, contractAddress, guess, lpMinted, market.SY.yieldToken.address, market.address, market.chainId, slippagePercent, trade, ytMinted, zeroPriceImpactMode],
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
