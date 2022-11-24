import type { UseMutationOptions } from '@tanstack/react-query'
import type { StableSwap } from '@zenlink-interface/amm'
import type { SendTransactionArgs, SendTransactionResult } from 'wagmi/actions'

export type UseSendTransactionArgs = Omit<SendTransactionArgs, 'request' | 'type'>

export interface MutationConfig<Data, Error, Variables = void> {
  /** Function fires if mutation encounters error */
  onError?: UseMutationOptions<Data, Error, Variables>['onError']
  /**
   * Function fires before mutation function and is passed same variables mutation function would receive.
   * Value returned from this function will be passed to both onError and onSettled functions in event of a mutation failure.
   */
  onMutate?: UseMutationOptions<Data, Error, Variables>['onMutate']
  /** Function fires when mutation is either successfully fetched or encounters error */
  onSettled?: UseMutationOptions<Data, Error, Variables>['onSettled']
  /** Function fires when mutation is successful and will be passed the mutation's result */
  onSuccess?: UseMutationOptions<Data, Error, Variables>['onSuccess']
}

export type UseSendTransactionConfig = MutationConfig<SendTransactionResult, Error, SendTransactionArgs>

export interface StableSwapWithBase extends StableSwap {
  baseSwap?: StableSwap
}
