import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Type } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import { calculateSlippageAmount } from '@zenlink-interface/amm'
import { Percent } from '@zenlink-interface/math'
import { Button, Dots } from '@zenlink-interface/ui'
import {
  Approve,
  PairState,
  calculateGasMargin,
  getStandardRouterContractConfig,
  useSendTransaction,
  useStandardRouterContract,
} from '@zenlink-interface/wagmi'
import type { Dispatch, FC, ReactNode, SetStateAction } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import type { SendTransactionResult } from 'wagmi/actions'

import { useTransactionDeadline } from 'lib/hooks'
import { useNotifications, useSettings } from 'lib/state/storage'
import type { TransactionRequest } from '@ethersproject/providers'
import { AddSectionReviewModal } from './AddSectionReviewModal'

interface AddSectionReviewModalStandardProps {
  poolState: PairState
  chainId: ParachainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  children({ isWritePending, setOpen }: { isWritePending: boolean; setOpen(open: boolean): void }): ReactNode
}

export const AddSectionReviewModalStandard: FC<AddSectionReviewModalStandardProps> = ({
  poolState,
  chainId,
  token0,
  token1,
  input0,
  input1,
  children,
}) => {
  const ethereumChainId = chainsParachainIdToChainId[chainId ?? -1]
  const deadline = useTransactionDeadline(ethereumChainId)
  const [open, setOpen] = useState(false)
  const { address } = useAccount()
  const { chain } = useNetwork()

  const [, { createNotification }] = useNotifications(address)
  const contract = useStandardRouterContract(chainId)
  const [{ slippageTolerance }] = useSettings()

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !token0 || !token1)
        return

      const ts = new Date().getTime()
      createNotification({
        type: 'mint',
        chainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Adding liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          completed: `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          failed: 'Something went wrong when adding liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, token0, token1],
  )

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      input0
        ? poolState === PairState.NOT_EXISTS
          ? input0
          : Amount.fromRawAmount(input0.currency, calculateSlippageAmount(input0, slippagePercent)[0])
        : undefined,
      input1
        ? poolState === PairState.NOT_EXISTS
          ? input1
          : Amount.fromRawAmount(input1.currency, calculateSlippageAmount(input1, slippagePercent)[0])
        : undefined,
    ]
  }, [poolState, input0, input1, slippagePercent])

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      try {
        if (
          !token0
          || !token1
          || !chain?.id
          || !contract
          || !input0
          || !input1
          || !address
          || !minAmount0
          || !minAmount1
          || !deadline
        )
          return
        const withNative = token0.isNative || token1.isNative

        if (withNative) {
          const value = (token1.isNative ? input1 : input0).quotient.toString()
          const args = [
            (token1.isNative ? token0 : token1).wrapped.address,
            (token1.isNative ? input0 : input1).quotient.toString(),
            (token1.isNative ? minAmount0 : minAmount1).quotient.toString(),
            (token1.isNative ? minAmount1 : minAmount0).quotient.toString(),
            address,
            deadline.toHexString(),
          ]
          const gasLimit = await contract.estimateGas.addLiquidityNativeCurrency(...args, { value })

          setRequest({
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData('addLiquidityNativeCurrency', args),
            value,
            gasLimit: calculateGasMargin(gasLimit),
          })
        }
        else {
          const args = [
            token0.wrapped.address,
            token1.wrapped.address,
            input0.quotient.toString(),
            input1.quotient.toString(),
            minAmount0.quotient.toString(),
            minAmount1.quotient.toString(),
            address,
            deadline.toHexString(),
          ]

          const gasLimit = await contract.estimateGas.addLiquidity(...args, {})
          setRequest({
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData('addLiquidity', args),
            gasLimit: calculateGasMargin(gasLimit),
          })
        }
      }
      catch (e: unknown) {}
    },
    [token0, token1, chain?.id, contract, input0, input1, address, minAmount0, minAmount1, deadline],
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess: () => setOpen(false),
  })

  return useMemo(
    () => (
      <>
        {children({ isWritePending, setOpen })}
        <AddSectionReviewModal chainId={chainId} input0={input0} input1={input1} open={open} setOpen={setOpen}>
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
                  address={getStandardRouterContractConfig(chainId).address}
                />
                <Approve.Token
                  size="md"
                  className="whitespace-nowrap"
                  fullWidth
                  amount={input1}
                  address={getStandardRouterContractConfig(chainId).address}
                />
              </Approve.Components>
            }
            render={({ approved }) => {
              return (
                <Button size="md" disabled={!approved || isWritePending} fullWidth onClick={() => sendTransaction?.()}>
                  {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add'}
                </Button>
              )
            }}
          />
        </AddSectionReviewModal>
      </>
    ),
    [chainId, children, createNotification, input0, input1, isWritePending, open, sendTransaction],
  )
}
