import type { SendTransactionResult } from '@wagmi/core'
import { waitForTransaction } from 'wagmi/actions'
import type { AggregatorTrade, Trade } from '@zenlink-interface/amm'
import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useAccount,
  usePrepareSendTransaction,
  usePublicClient,
  useSendTransaction,
} from 'wagmi'
import { log } from 'next-axiom'
import stringify from 'fast-json-stable-stringify'
import { Percent } from '@zenlink-interface/math'
import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { t } from '@lingui/macro'
import type { Address } from 'viem'
import { ProviderRpcError, UserRejectedRequestError } from 'viem'
import { BigNumber } from 'ethers'
import { PERMIT2_ADDRESS } from '@uniswap/permit2-sdk'
import { calculateGasMargin } from '../calculateGasMargin'
import { SwapRouter } from '../SwapRouter'
import type { WagmiTransactionRequest } from '../types'
import { useRouters } from './useRouters'
import { useTransactionDeadline } from './useTransactionDeadline'
import { ApprovalState, useERC20ApproveCallback } from './useERC20ApproveCallback'
import type { Permit2Actions } from './usePermit2ApproveCallback'

const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // 0.50%

interface SwapCall {
  address: Address
  calldata: Address
  value: string
}

interface UseSwapReviewParams {
  chainId: number | undefined
  trade: Trade | AggregatorTrade | undefined
  enableNetworks: ParachainId[]
  open: boolean
  enablePermit2?: boolean
  permit2Actions?: Permit2Actions
  setOpen: Dispatch<SetStateAction<boolean>>
  setError: Dispatch<SetStateAction<string | undefined>>
  onSuccess(): void
}

type UseSwapReview = (params: UseSwapReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useSwapReview: UseSwapReview = ({
  chainId,
  trade,
  setOpen,
  setError,
  onSuccess,
  enablePermit2,
  permit2Actions,
  open,
  enableNetworks,
}) => {
  const ethereumChainId = chainsParachainIdToChainId[chainId ?? -1]
  const { address: account } = useAccount()
  const provider = usePublicClient({ chainId: ethereumChainId })
  const [, { createNotification }] = useNotifications(account)

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!trade || !chainId || !data)
        return

      const ts = new Date().getTime()
      waitForTransaction({ hash: data.hash })
        .then((tx) => {
          log.info('swap success', {
            transactionHash: tx.transactionHash,
            chainId: trade.inputAmount.currency.chainId,
            tokenInAddress: trade.inputAmount.currency.isNative ? 'NATIVE' : trade.inputAmount.currency.address,
            tokenOutAddress: trade.outputAmount.currency.isNative ? 'NATIVE' : trade.outputAmount.currency.address,
            tokenInSymbol: trade.inputAmount.currency.symbol,
            tokenOutSymbol: trade.outputAmount.currency.symbol,
            tokenInAmount: trade.inputAmount.toFixed(),
            tokenOutAmount: trade.outputAmount.toFixed(),
          })
        })
        .catch((error: unknown) => {
          log.error('swap failure', {
            error: stringify(error),
            chainId: trade.inputAmount.currency.chainId,
            tokenInAddress: trade.inputAmount.currency.isNative ? 'NATIVE' : trade.inputAmount.currency.address,
            tokenOutAddress: trade.outputAmount.currency.isNative ? 'NATIVE' : trade.outputAmount.currency.address,
            tokenInSymbol: trade.inputAmount.currency.symbol,
            tokenOutSymbol: trade.outputAmount.currency.symbol,
            tokenInAmount: trade.inputAmount.toFixed(),
            tokenOutAmount: trade.outputAmount.toFixed(),
          })
        })

      createNotification({
        type: 'swap',
        chainId,
        txHash: data.hash,
        promise: waitForTransaction({ hash: data.hash }),
        summary: {
          pending: t`Swapping ${trade.inputAmount.toSignificant(6)} ${trade.inputAmount.currency.symbol
            } for ${trade.outputAmount.toSignificant(6)} ${trade.outputAmount.currency.symbol}`,
          completed: t`Successfully swapped ${trade.inputAmount.toSignificant(6)} ${trade.inputAmount.currency.symbol
            } for ${trade.outputAmount.toSignificant(6)} ${trade.outputAmount.currency.symbol}`,
          failed: t`Something went wrong when trying to swap ${trade.inputAmount.currency.symbol} for ${trade.outputAmount.currency.symbol}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, trade],
  )

  const [request, setRequest] = useState<WagmiTransactionRequest>()
  const { config } = usePrepareSendTransaction({
    ...request,
    chainId: ethereumChainId,
    enabled: !!trade && !!request,
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

  const [swapRouter] = useRouters(chainId, enableNetworks, trade?.version)
  const deadline = useTransactionDeadline(ethereumChainId, open)
  const [{ slippageTolerance }] = useSettings()

  const [approvalState] = useERC20ApproveCallback(true, trade?.inputAmount, swapRouter?.address)
  const [permit2ApprovalState] = useERC20ApproveCallback(true, trade?.inputAmount, PERMIT2_ADDRESS)

  const isToUsePermit2 = useMemo(() => {
    if (!enablePermit2 || permit2ApprovalState !== ApprovalState.APPROVED)
      return false
    if (!permit2Actions)
      return false
    if (permit2Actions.state === ApprovalState.APPROVED)
      return true
    return false
  }, [enablePermit2, permit2Actions, permit2ApprovalState])

  const allowedSlippage = useMemo(
    () => (slippageTolerance ? new Percent(slippageTolerance * 100, 10_000) : SWAP_DEFAULT_SLIPPAGE),
    [slippageTolerance],
  )

  const prepare = useCallback(async () => {
    if (
      !trade
      || !account
      || !chainId
      || !deadline
      || (
        isToUsePermit2
          ? permit2Actions?.state !== ApprovalState.APPROVED
          : approvalState !== ApprovalState.APPROVED
      )
    )
      return

    try {
      let call: SwapCall | null = null
      let value = '0x0'

      if (trade) {
        if (!swapRouter || !deadline)
          return
        const { methodName, args, value: _value } = SwapRouter.swapCallParameters(
          trade,
          {
            allowedSlippage,
            recipient: account,
            deadline: deadline.toNumber(),
            isToUsePermit2,
            permitSingle: permit2Actions?.permitSingle,
            signature: permit2Actions?.signature,
          },
        )
        value = _value

        call = {
          address: swapRouter.address as Address,
          calldata: swapRouter.interface.encodeFunctionData(methodName, args) as Address,
          value,
        }
      }

      if (call) {
        if (!isAddress(call.address))
          throw new Error('call address has to be an address')
        if (call.address === AddressZero)
          throw new Error('call address cannot be zero')

        const tx
          = !value || /^0x0*$/.test(value)
            ? { account, to: call.address, data: call.calldata }
            : {
                account,
                to: call.address,
                data: call.calldata,
                value: BigInt(value),
              }

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
  }, [account, allowedSlippage, approvalState, chainId, deadline, isToUsePermit2, permit2Actions?.permitSingle, permit2Actions?.signature, permit2Actions?.state, provider, setError, swapRouter, trade])

  useEffect(() => {
    prepare()
  }, [prepare])

  return useMemo(() => ({
    isWritePending,
    sendTransaction,
    routerAddress: swapRouter?.address,
  }), [isWritePending, sendTransaction, swapRouter?.address])
}
