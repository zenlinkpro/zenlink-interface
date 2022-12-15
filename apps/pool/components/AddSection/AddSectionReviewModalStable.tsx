import { PlusIcon } from '@heroicons/react/24/solid'
import type { StableSwap as GraphStableSwap } from '@zenlink-interface/graph-client'
import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { Percent } from '@zenlink-interface/math'
import type { StableSwapWithBase } from '@zenlink-interface/wagmi'
import {
  Approve,
  calculateGasMargin,
  getStableRouterContractConfig,
  useSendTransaction,
  useStableRouterContract,
} from '@zenlink-interface/wagmi'
import { useTokenAmountDollarValues, useTransactionDeadline } from 'lib/hooks'
import { useNotifications, useSettings } from 'lib/state/storage'
import type { Dispatch, FC, ReactNode, SetStateAction } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import type { SendTransactionResult } from 'wagmi/actions'
import { calculateSlippageAmount } from '@zenlink-interface/amm'
import { Button, Currency, Dialog, Dots, Typography } from '@zenlink-interface/ui'
import type { Amount, Token } from '@zenlink-interface/currency'
import type { TransactionRequest } from '@ethersproject/providers'
import type { CalculatedStbaleSwapLiquidity } from './types'

interface AddSectionReviewModalStableProps {
  swap: StableSwapWithBase | undefined
  pool: GraphStableSwap | undefined
  inputs: Amount<Token>[]
  chainId: ParachainId
  useBase: boolean
  liquidity: CalculatedStbaleSwapLiquidity
  children({ isWritePending, setOpen }: { isWritePending: boolean; setOpen(open: boolean): void }): ReactNode
}

export const AddSectionReviewModalStable: FC<AddSectionReviewModalStableProps> = ({
  chainId,
  swap,
  useBase,
  liquidity,
  inputs,
  pool,
  children,
}) => {
  const ethereumChainId = chainsParachainIdToChainId[chainId ?? -1]
  const deadline = useTransactionDeadline(ethereumChainId)
  const [open, setOpen] = useState(false)
  const { address } = useAccount()
  const { chain } = useNetwork()

  const [, { createNotification }] = useNotifications(address)
  const contract = useStableRouterContract(chainId)
  const [{ slippageTolerance }] = useSettings()

  const values = useTokenAmountDollarValues({ chainId, amounts: inputs })

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !swap || !pool)
        return

      const ts = new Date().getTime()
      createNotification({
        type: 'mint',
        chainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Adding liquidity to the ${pool.name} stable pool`,
          completed: `Successfully added liquidity to the ${pool.name} stable pool`,
          failed: 'Something went wrong when adding liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, pool, swap],
  )

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      try {
        const { amount, baseAmounts, metaAmounts } = liquidity
        if (
          !swap
          || !amount
          || !pool
          || !inputs.length
          || !chain?.id
          || !address
          || !deadline
          || !contract
        )
          return

        if (swap.baseSwap && useBase) {
          const args = [
            swap.contractAddress,
            swap.baseSwap.contractAddress,
            metaAmounts.map(amount => amount.quotient.toString()),
            baseAmounts.map(amount => amount.quotient.toString()),
            calculateSlippageAmount(amount, slippagePercent)[0].toString(),
            address,
            deadline.toHexString(),
          ]

          const gasLimit = await contract.estimateGas.addPoolAndBaseLiquidity(...args, {})
          setRequest({
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData('addPoolAndBaseLiquidity', args),
            gasLimit: calculateGasMargin(gasLimit),
          })
        }
        else {
          const args = [
            swap.contractAddress,
            metaAmounts.map(amount => amount.quotient.toString()),
            calculateSlippageAmount(amount, slippagePercent)[0].toString(),
            address,
            deadline.toHexString(),
          ]

          const gasLimit = await contract.estimateGas.addPoolLiquidity(...args, {})
          setRequest({
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData('addPoolLiquidity', args),
            gasLimit: calculateGasMargin(gasLimit),
          })
        }
      }
      catch (e: unknown) { }
    },
    [address, chain?.id, contract, deadline, inputs.length, liquidity, pool, slippagePercent, swap, useBase],
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
        <Dialog open={open} onClose={() => setOpen(false)}>
          <Dialog.Content className="max-w-sm !pb-4">
            <Dialog.Header border={false} title="Add Liquidity" onClose={() => setOpen(false)} />
            <div className="!my-0 grid grid-cols-1 items-center">
              {inputs.map((input, i) => (
                <div key={input.currency.address}>
                  <div className="flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-700/40 border-slate-200/5">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-between w-full gap-2">
                        <Typography variant="h3" weight={500} className="truncate text-slate-50">
                          {input?.toSignificant(6)}{' '}
                        </Typography>
                        <div className="flex items-center justify-end gap-2 text-right">
                          {input && (
                            <div className="w-5 h-5">
                              <Currency.Icon currency={input.currency} width={20} height={20} />
                            </div>
                          )}
                          <Typography variant="h3" weight={500} className="text-right text-slate-50">
                            {input?.currency.symbol}
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <Typography variant="sm" weight={500} className="text-slate-500">
                      {values[i] ? `$${values[i].toFixed(2)}` : '-'}
                    </Typography>
                  </div>
                  {i < inputs.length - 1 && (
                    <div className="flex items-center justify-center col-span-12 -mt-2.5 -mb-2.5">
                      <div className="p-0.5 bg-slate-700 border-2 border-slate-800 ring-1 ring-slate-200/5 z-10 rounded-full">
                        <PlusIcon width={18} height={18} className="text-slate-200" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center p-4">
              <Typography
                as="button"
                variant="sm"
                weight={600}
                className="flex items-center gap-1 text-slate-100"
              >
                You&apos;ll receive: {liquidity.amount && pool && <span className="font-normal text-slate-300">{liquidity.amount.toSignificant(6)} {pool.name} lp</span>}
              </Typography>
            </div>
            <Approve
              onSuccess={createNotification}
              className="flex-grow !justify-end"
              components={
                <Approve.Components>
                  {inputs.map(input => (
                    <Approve.Token
                      key={input.currency.address}
                      size="md"
                      className="whitespace-nowrap"
                      fullWidth
                      amount={input}
                      address={getStableRouterContractConfig(chainId).address}
                    />
                  ))}
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
          </Dialog.Content>
        </Dialog>
      </>
    ),
    [chainId, children, createNotification, inputs, isWritePending, liquidity.amount, open, pool, sendTransaction, values],
  )
}
