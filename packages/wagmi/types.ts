import type { UseMutationOptions } from '@tanstack/react-query'
import type { SendTransactionArgs, SendTransactionResult } from '@wagmi/core'
import type { StableSwap } from '@zenlink-interface/amm'
import type { Amount, Token } from '@zenlink-interface/currency'
import type { Account, Address } from 'viem'

export type UseSendTransactionArgs<TMode extends 'prepared' | undefined = 'prepared' | undefined> = Omit<SendTransactionArgs, 'to'> & {
  mode?: TMode
  to?: string
}

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

export type UseSendTransactionConfig = MutationConfig<SendTransactionResult, Error, UseSendTransactionArgs>

export interface StableSwapWithBase extends StableSwap {
  baseSwap?: StableSwap
}

export interface CalculatedStbaleSwapLiquidity {
  amount?: Amount<Token>
  baseAmounts: Amount<Token>[]
  metaAmounts: Amount<Token>[]
}

export interface WagmiTransactionRequest {
  account?: Account | Address | undefined
  to: Address
  data?: `0x${string}` | undefined
  gas?: bigint | undefined
  value?: bigint | undefined
}
