import { chainsChainIdToParachainId } from '@zenlink-interface/chain'
import type { Amount, Currency } from '@zenlink-interface/currency'
import type { NotificationData } from '@zenlink-interface/ui'
import { useCallback, useMemo, useState } from 'react'
import { useAccount, useSendTransaction } from 'wagmi'
import { t } from '@lingui/macro'
import type { Address } from 'viem'
import { UserRejectedRequestError, encodeFunctionData, maxUint256 } from 'viem'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { erc20ABI } from '@wagmi/core'
import { config } from '../client'
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
  const { address, chain } = useAccount()
  const [useExact] = useState(false)
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined

  const request = useMemo(() => ({
    account: address,
    to: token?.address as Address,
    value: BigInt(0),
    data: spender && amountToApprove
      ? encodeFunctionData({
        abi: erc20ABI,
        functionName: 'approve',
        args: [
          spender as Address,
          useExact ? BigInt(amountToApprove?.quotient.toString()) : maxUint256,
        ],
      })
      : undefined,
  }), [address, amountToApprove, spender, token?.address, useExact])

  const { sendTransactionAsync, isPending: isWritePending } = useSendTransaction()

  const currentAllowance = useERC20Allowance(watch, token, address, spender)

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
      const hash = await sendTransactionAsync(request)

      if (onSuccess) {
        const ts = new Date().getTime()

        onSuccess({
          type: 'approval',
          chainId: chainsChainIdToParachainId[chain?.id ?? -1],
          txHash: hash,
          promise: waitForTransactionReceipt(config, { hash }),
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
  }, [amountToApprove, approvalState, chain?.id, onSuccess, request, sendTransactionAsync, spender, token])

  return [approvalState, approve]
}
