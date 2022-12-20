import type { TransactionRequest } from '@ethersproject/providers'
import type { FC, ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ProviderRpcError, UserRejectedRequestError, useAccount, usePrepareSendTransaction, useProvider, useSendTransaction } from 'wagmi'
import type { SendTransactionResult } from 'wagmi/actions'
import { log } from 'next-axiom'
import stringify from 'fast-json-stable-stringify'
import { useRouters, useTransactionDeadline } from 'lib/hooks'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { Percent } from '@zenlink-interface/math'
import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Approve, calculateGasMargin } from '@zenlink-interface/wagmi'
import { Button, Dots } from '@zenlink-interface/ui'
import { SwapRouter } from '@zenlink-interface/amm'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import { useTrade } from '../TradeProvider'
import { SwapReviewModalBase } from './SwapReviewModalBase'

interface SwapReviewModalProps {
  chainId: number | undefined
  children({ isWritePending, setOpen }: { isWritePending: boolean; setOpen(open: boolean): void }): ReactNode
  onSuccess(): void
}

interface SwapCall {
  address: string
  calldata: string
  value: string
}

const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // 0.50%

export const SwapReviewModal: FC<SwapReviewModalProps> = ({ chainId, children, onSuccess }) => {
  const ethereumChainId = chainsParachainIdToChainId[chainId ?? -1]
  const { trade } = useTrade()
  const { address: account } = useAccount()
  const provider = useProvider({ chainId: ethereumChainId })
  const [, { createNotification }] = useNotifications(account)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!trade || !chainId || !data)
        return

      const ts = new Date().getTime()
      // data: SendTransactionResult | undefined, error: Error | null
      data
        .wait()
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
        promise: data.wait(),
        summary: {
          pending: `Swapping ${trade.inputAmount.toSignificant(6)} ${trade.inputAmount.currency.symbol
            } for ${trade.outputAmount.toSignificant(6)} ${trade.outputAmount.currency.symbol}`,
          completed: `Successfully swapped ${trade.inputAmount.toSignificant(6)} ${trade.inputAmount.currency.symbol
            } for ${trade.outputAmount.toSignificant(6)} ${trade.outputAmount.currency.symbol}`,
          failed: `Something went wrong when trying to swap ${trade.inputAmount.currency.symbol} for ${trade.outputAmount.currency.symbol}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, trade],
  )

  const [request, setRequest] = useState<TransactionRequest & { to: string }>()
  const { config } = usePrepareSendTransaction({
    request,
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

  const [swapRouter] = useRouters(chainId)
  const deadline = useTransactionDeadline(ethereumChainId, open)
  const [{ slippageTolerance }] = useSettings()

  const allowedSlippage = useMemo(
    () => (slippageTolerance ? new Percent(slippageTolerance * 100, 10_000) : SWAP_DEFAULT_SLIPPAGE),
    [slippageTolerance],
  )

  const prepare = useCallback(async () => {
    if (!trade || !account || !chainId || !deadline)
      return
    // console.log('prepare swap', { trade, account, chainId, deadline: deadline.toString() })

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
          },
        )
        value = _value

        call = {
          address: swapRouter.address,
          calldata: swapRouter.interface.encodeFunctionData(methodName, args),
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
            ? { from: account, to: call.address, data: call.calldata }
            : {
                from: account,
                to: call.address,
                data: call.calldata,
                value,
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
          ...('gasEstimate' in estimatedCall ? { gasLimit: calculateGasMargin(estimatedCall.gasEstimate) } : {}),
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
  }, [account, allowedSlippage, chainId, deadline, trade, swapRouter, provider])

  useEffect(() => {
    prepare()
  }, [prepare])

  const [input0, input1] = useMemo(
    () => [trade?.inputAmount, trade?.outputAmount],
    [trade?.inputAmount, trade?.outputAmount],
  )

  return (
    <>
      {children({ isWritePending, setOpen })}
      <SwapReviewModalBase
        chainId={chainId}
        input0={input0}
        input1={input1}
        open={open}
        setOpen={setOpen}
        error={error}
      >
        <Approve
          onSuccess={createNotification}
          className="flex-grow !justify-end"
          components={
            <Approve.Components>
              <Approve.Token
                size="md"
                className="whitespace-nowrap"
                fullWidth
                amount={input0}
                address={swapRouter?.address}
                enabled={trade?.inputAmount?.currency?.isToken}
              />
            </Approve.Components>
          }
          render={({ approved }) => {
            return (
              <Button size="md" disabled={!approved || isWritePending} fullWidth onClick={() => sendTransaction?.()}>
                {isWritePending ? <Dots>Confirm Swap</Dots> : 'Swap'}
              </Button>
            )
          }}
        />
      </SwapReviewModalBase>
    </>
  )
}
