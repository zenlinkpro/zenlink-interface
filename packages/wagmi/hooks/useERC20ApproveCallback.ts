import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import { chainsChainIdToParachainId } from '@zenlink-interface/chain'
import type { Amount, Currency } from '@zenlink-interface/currency'
import type { NotificationData } from '@zenlink-interface/ui'
import { BigNumber } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  erc20ABI,
  useAccount,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
  useWalletClient,
} from 'wagmi'
import type { Address } from 'wagmi'
import { t } from '@lingui/macro'
import { getContract, waitForTransaction } from 'wagmi/actions'
import { UserRejectedRequestError, encodeFunctionData } from 'viem'
import { calculateGasMargin } from '../calculateGasMargin'
import { useERC20Allowance } from './useERC20Allowance'

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useERC20ApproveCallback(
  watch: boolean,
  amountToApprove?: Amount<Currency>,
  spender?: string,
  onSuccess?: (data: NotificationData) => void,
): [ApprovalState, () => Promise<void>] {
  const { chain } = useNetwork()
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [gasLimit, setGasLimit] = useState<BigNumber>()
  const [useExact, setUseExact] = useState(false)
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
  const tokenContract = getContract({
    address: (token?.address ?? AddressZero) as Address,
    abi: erc20ABI,
    walletClient: walletClient ?? undefined,
  })

  const { config } = usePrepareSendTransaction({
    account: address,
    to: token?.address,
    data: encodeFunctionData({
      abi: erc20ABI,
      functionName: 'approve',
      args: [
        spender as Address,
        useExact ? BigNumber.from(amountToApprove?.quotient.toString()).toBigInt() : MaxUint256.toBigInt(),
      ],
    }),
    gas: gasLimit?.toBigInt(),
    enabled: Boolean(gasLimit && address && tokenContract),
  })
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction(config)

  const currentAllowance = useERC20Allowance(watch, token, address ?? undefined, spender)

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender)
      return ApprovalState.UNKNOWN
    if (amountToApprove.currency.isNative)
      return ApprovalState.APPROVED
    if (isWritePending)
      return ApprovalState.PENDING

    // We might not have enough data to know whether we need to approve
    if (!currentAllowance)
      return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove) ? ApprovalState.NOT_APPROVED : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, isWritePending, spender])

  useEffect(() => {
    if (
      chain?.id
      && approvalState === ApprovalState.NOT_APPROVED
      && tokenContract
      && amountToApprove
      && spender
    ) {
      tokenContract.estimateGas.approve([spender as Address, MaxUint256.toBigInt()])
        .then((estimatedGas) => {
          setGasLimit(calculateGasMargin(BigNumber.from(estimatedGas)))
        })
        .catch(() => {
          // General fallback for tokens who restrict approval amounts
          tokenContract.estimateGas.approve(
            [
              spender as Address,
              BigNumber.from(amountToApprove.quotient.toString()).toBigInt(),
            ],
          )
            .then((estimatedGas) => {
              setUseExact(true)
              setGasLimit(calculateGasMargin(BigNumber.from(estimatedGas)))
            })
        })
    }
  }, [chain?.id, approvalState, tokenContract, amountToApprove, spender])

  const approve = useCallback(async (): Promise<void> => {
    if (!chain?.id) {
      console.error('Not connected')
      return
    }

    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }

    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    try {
      if (!sendTransactionAsync)
        return
      const data = await sendTransactionAsync()

      if (onSuccess) {
        const ts = new Date().getTime()
        onSuccess({
          type: 'approval',
          chainId: chainsChainIdToParachainId[chain?.id ?? -1],
          txHash: data.hash,
          promise: waitForTransaction({ hash: data.hash }),
          summary: {
            pending: t`Approving ${amountToApprove.currency.symbol}`,
            completed: t`Successfully approved ${amountToApprove.currency.symbol}`,
            failed: t`Something went wrong approving ${amountToApprove.currency.symbol}`,
          },
          groupTimestamp: ts,
          timestamp: ts,
        })
      }
    }
    catch (e: unknown) {
      if (e instanceof UserRejectedRequestError)
        return
      console.error(e)
    }
  }, [
    chain?.id,
    approvalState,
    token,
    tokenContract,
    amountToApprove,
    spender,
    sendTransactionAsync,
    onSuccess,
  ])

  return [approvalState, approve]
}
