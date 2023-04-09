import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import { chainsChainIdToParachainId } from '@zenlink-interface/chain'
import type { Amount, Currency } from '@zenlink-interface/currency'
import type { NotificationData } from '@zenlink-interface/ui'
import { BigNumber } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Address } from 'wagmi'
import {
  UserRejectedRequestError,
  erc20ABI,
  useAccount,
  useContract,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
  useSigner,
} from 'wagmi'

import { t } from '@lingui/macro'
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
  const [gasLimit, setGasLimit] = useState<BigNumber>()
  const [useExact, setUseExact] = useState(false)
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
  const tokenContract = useContract({
    address: token?.address ?? AddressZero,
    abi: erc20ABI,
    signerOrProvider: signer,
  })
  const { config } = usePrepareSendTransaction({
    request: {
      from: address,
      to: tokenContract?.address as Address,
      data: tokenContract?.interface.encodeFunctionData('approve', [
        spender,
        useExact ? amountToApprove?.quotient.toString() : MaxUint256,
      ]),
      gasLimit,
    },
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
      tokenContract.estimateGas.approve(spender as Address, MaxUint256)
        .then((estimatedGas) => {
          setGasLimit(calculateGasMargin(estimatedGas))
        })
        .catch(() => {
          // General fallback for tokens who restrict approval amounts
          tokenContract.estimateGas.approve(
            spender as Address,
            BigNumber.from(amountToApprove.quotient.toString()),
          )
            .then((estimatedGas) => {
              setUseExact(true)
              setGasLimit(calculateGasMargin(estimatedGas))
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
          promise: data.wait(),
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
