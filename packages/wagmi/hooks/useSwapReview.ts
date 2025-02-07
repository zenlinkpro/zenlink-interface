import type { AggregatorTrade, Trade } from '@zenlink-interface/amm'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Dispatch, SetStateAction } from 'react'
import type { Abi, Address } from 'viem'
import type { SendTransactionData } from 'wagmi/query'
import type { WagmiTransactionRequest } from '../types'
import type { Permit2Actions } from './usePermit2ApproveCallback'
import { isAddress } from '@ethersproject/address'
import { t } from '@lingui/macro'
import { PERMIT2_ADDRESS } from '@uniswap/permit2-sdk'
import { chainsParachainIdToChainId, isEvmNetwork } from '@zenlink-interface/chain'
import { Percent } from '@zenlink-interface/math'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import stringify from 'fast-json-stable-stringify'
import { log } from 'next-axiom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { encodeFunctionData, zeroAddress } from 'viem'
import { useAccount, useEstimateGas, useSendTransaction } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { config } from '../client'
import { SwapRouter } from '../SwapRouter'
import { ApprovalState, useERC20ApproveCallback } from './useERC20ApproveCallback'
import { useRouters } from './useRouters'
import { useTransactionDeadline } from './useTransactionDeadline'

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
  onSuccess: () => void
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
  onSuccess,
  enablePermit2,
  permit2Actions,
  open,
  enableNetworks,
}) => {
  const ethereumChainId = chainsParachainIdToChainId[chainId && isEvmNetwork(chainId) ? chainId : -1]
  const { address: account } = useAccount()
  const [, { createNotification }] = useNotifications(account)

  const onSettled = useCallback(
    async (hash: SendTransactionData | undefined) => {
      if (!trade || !chainId || !hash)
        return

      const ts = new Date().getTime()

      waitForTransactionReceipt(config, { hash })
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
        txHash: hash,
        promise: waitForTransactionReceipt(config, { hash }),
        summary: {
          pending: t`Swapping ${trade.inputAmount.toSignificant(6)} ${trade.inputAmount.currency.symbol || 'symbol'
          } for ${trade.outputAmount.toSignificant(6)} ${trade.outputAmount.currency.symbol || 'symbol'}`,
          completed: t`Successfully swapped ${trade.inputAmount.toSignificant(6)} ${trade.inputAmount.currency.symbol || 'symbol'
          } for ${trade.outputAmount.toSignificant(6)} ${trade.outputAmount.currency.symbol || 'symbol'}`,
          failed: t`Something went wrong when trying to swap ${trade.inputAmount.currency.symbol || 'symbol'} for ${trade.outputAmount.currency.symbol || 'symbol'}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, trade],
  )

  const [request, setRequest] = useState<WagmiTransactionRequest>()

  const estimateGas = useEstimateGas({ ...request, chainId: ethereumChainId })
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

  const swapRouter = useRouters(chainId, enableNetworks, trade?.version)
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

  const prepare = useCallback(() => {
    try {
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
      ) {
        return
      }

      let call: SwapCall | null = null
      let value = '0x0'

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
        calldata: encodeFunctionData({
          abi: swapRouter.abi as Abi,
          functionName: methodName,
          args,
        }),
        value,
      }

      if (call) {
        if (!isAddress(call.address))
          throw new Error('call address has to be an address')
        if (call.address === zeroAddress)
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

        setRequest({ ...tx })
      }
    }
    catch {}
  }, [account, allowedSlippage, approvalState, chainId, deadline, isToUsePermit2, permit2Actions?.permitSingle, permit2Actions?.signature, permit2Actions?.state, swapRouter, trade])

  useEffect(() => {
    prepare()
  }, [prepare])

  return useMemo(() => ({
    isWritePending,
    sendTransaction: request && estimateGas
      ? () => sendTransaction({ ...request })
      : undefined,
    routerAddress: swapRouter?.address,
  }), [estimateGas, isWritePending, request, sendTransaction, swapRouter?.address])
}
