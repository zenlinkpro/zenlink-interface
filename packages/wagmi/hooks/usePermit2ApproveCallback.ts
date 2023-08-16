import type { Amount, Currency } from '@zenlink-interface/currency'
import { useMemo } from 'react'
import type { Address } from 'wagmi'
import { useAccount, useNetwork, useSignTypedData } from 'wagmi'
import ms from 'ms'
import type { PermitSingle } from '@uniswap/permit2-sdk'
import { AllowanceTransfer, MaxAllowanceTransferAmount, PERMIT2_ADDRESS } from '@uniswap/permit2-sdk'
import type { TypedDataDomain } from 'viem'
import { ApprovalState } from './useERC20ApproveCallback'
import { usePermit2Allowance } from './usePermit2Allowance'

const PERMIT_DETAILS = [
  { name: 'token', type: 'address' },
  { name: 'amount', type: 'uint160' },
  { name: 'expiration', type: 'uint48' },
  { name: 'nonce', type: 'uint48' },
]

const PERMIT_TYPES = {
  PermitSingle: [
    { name: 'details', type: 'PermitDetails' },
    { name: 'spender', type: 'address' },
    { name: 'sigDeadline', type: 'uint256' },
  ],
  PermitDetails: PERMIT_DETAILS,
}

const PERMIT_EXPIRATION = ms('30d')
const PERMIT_SIG_EXPIRATION = ms('30m')

function toDeadline(expiration: number): number {
  return Math.floor((Date.now() + expiration) / 1000)
}

export interface Permit2Actions {
  state: ApprovalState
  sign?: () => void
  permitSingle?: PermitSingle | undefined
  signature?: Address | undefined
}

export function usePermit2ApproveCallback(
  watch: boolean,
  amountToApprove?: Amount<Currency>,
  spender?: string,
): Permit2Actions {
  const { chain } = useNetwork()
  const { address } = useAccount()
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined

  const currentAllowance = usePermit2Allowance(watch, token, address, spender)

  const permitData = useMemo(() => {
    if (!token || !currentAllowance || !spender || !chain)
      return undefined

    const permitSingle: PermitSingle = {
      details: {
        token: token.address,
        amount: MaxAllowanceTransferAmount.toBigInt(),
        expiration: toDeadline(/* 30 days= */ PERMIT_EXPIRATION),
        nonce: currentAllowance.nonce,
      },
      spender,
      sigDeadline: toDeadline(/* 30 minutes= */ PERMIT_SIG_EXPIRATION),
    }

    return AllowanceTransfer.getPermitData(permitSingle, PERMIT2_ADDRESS, chain.id)
  }, [chain, currentAllowance, spender, token])

  const { data: signature, signTypedData, isLoading } = useSignTypedData({
    domain: permitData?.domain as TypedDataDomain,
    primaryType: 'PermitSingle',
    message: permitData?.values as { [k: string]: any },
    types: PERMIT_TYPES,
  })

  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender)
      return ApprovalState.UNKNOWN
    if (amountToApprove.currency.isNative)
      return ApprovalState.APPROVED
    if (isLoading)
      return ApprovalState.PENDING
    if (!currentAllowance)
      return ApprovalState.UNKNOWN

    // when we got the signature, that means we have already approved
    if (signature !== undefined)
      return ApprovalState.APPROVED

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.amount.lt(amountToApprove.quotient.toString()) || currentAllowance.expiration > toDeadline(0)
      ? ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, isLoading, signature, spender])

  return useMemo(() => ({
    state: approvalState,
    sign: signTypedData,
    permitSingle: permitData?.values as PermitSingle,
    signature,
  }), [approvalState, permitData?.values, signTypedData, signature])
}
