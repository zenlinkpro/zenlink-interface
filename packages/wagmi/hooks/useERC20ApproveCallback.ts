import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import { chainsChainIdToParachainId } from '@zenlink-interface/chain'
import type { Amount, Currency } from '@zenlink-interface/currency'
import type { NotificationData } from '@zenlink-interface/ui'
import { BigNumber } from 'ethers'
import { useCallback, useMemo } from 'react'
import {
  UserRejectedRequestError,
  erc20ABI,
  useAccount,
  useContract,
  useNetwork,
  useSendTransaction,
  useSigner,
} from 'wagmi'

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
  const { data: signer } = useSigner()
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction({ mode: 'recklesslyUnprepared' })

  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
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

  const tokenContract = useContract({
    address: token?.address ?? AddressZero,
    abi: erc20ABI,
    signerOrProvider: signer,
  })

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

    let useExact = false
    const estimatedGas = await tokenContract.estimateGas.approve(spender as `0x${string}`, MaxUint256).catch(() => {
      // General fallback for tokens who restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender as `0x${string}`, BigNumber.from(amountToApprove.quotient.toString()))
    })

    try {
      const data = await sendTransactionAsync({
        recklesslySetUnpreparedRequest: {
          from: address as `0x${string}`,
          to: tokenContract?.address as `0x${string}`,
          data: tokenContract.interface.encodeFunctionData('approve', [
            spender,
            useExact ? amountToApprove.quotient.toString() : MaxUint256,
          ]),
          gasLimit: calculateGasMargin(estimatedGas),
        },
      })

      if (onSuccess) {
        const ts = new Date().getTime()
        onSuccess({
          type: 'approval',
          chainId: chainsChainIdToParachainId[chain?.id ?? -1],
          txHash: data.hash,
          promise: data.wait(),
          summary: {
            pending: `Approving ${amountToApprove.currency.symbol}`,
            completed: `Successfully approved ${amountToApprove.currency.symbol}`,
            failed: `Something went wrong approving ${amountToApprove.currency.symbol}`,
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
    address,
    onSuccess,
  ])

  return [approvalState, approve]
}
