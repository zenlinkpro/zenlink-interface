import type { Percent } from '@zenlink-interface/math'
import { AddressZero } from '@ethersproject/constants'
import { Trade } from '@zenlink-interface/amm'
import type { AggregatorTrade } from '@zenlink-interface/amm'
import type { Address } from 'viem'
import { encodeAbiParameters, parseAbiParameters } from 'viem'
import type { PermitSingle } from '@uniswap/permit2-sdk'

export interface TradeOptions {
  /**
   * How much the execution price is allowed to move unfavorably from the trade execution price.
   */
  allowedSlippage: Percent
  /**
   * How long the swap is valid until it expires, in seconds.
   * This will be used to produce a `deadline` parameter which is computed from when the swap call parameters
   * are generated.
   */
  ttl: number
  /**
   * The account that should receive the output of the swap.
   */
  recipient: string
  /**
   * Permit2 Data
   */
  isToUsePermit2: boolean
  permitSingle?: PermitSingle | undefined
  signature?: Address | undefined
}

export interface TradeOptionsDeadline extends Omit<TradeOptions, 'ttl'> {
  /**
   * When the transaction expires.
   * This is an atlernate to specifying the ttl, for when you do not want to use local time.
   */
  deadline: number
}

export interface SwapParameters {
  methodName: string
  /**
   * The arguments to pass to the method, all hex encoded.
   */
  args: (string | any[] | { stable: boolean; callData: string }[])[]
  /**
   * The amount of wei to send in hex.
   */
  value: string
}

const ZERO_HEX = '0x0'

export abstract class SwapRouter {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static swapCallParameters(
    trade: Trade | AggregatorTrade,
    options: TradeOptions | TradeOptionsDeadline,
  ): SwapParameters {
    if (trade instanceof Trade) {
      const nativeIn = trade.inputAmount.currency.isNative
      const nativeOut = trade.outputAmount.currency.isNative

      const deadline
        = 'ttl' in options
          ? `0x${(Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16)}`
          : `0x${options.deadline.toString(16)}`

      let methodName = ''
      let args: (string | string[] | { stable: boolean; callData: string }[])[] = []
      let value = ''

      if (trade.route.routePath.some(route => route.stable)) {
        const paths = trade.route.routePath.map(
          path => path.stable
            ? {
                stable: true,
                callData: encodeAbiParameters(
                  parseAbiParameters('address, address, address, address, bool'),
                  [
                    (path.pool?.contractAddress ?? AddressZero) as Address,
                    (path.basePool?.contractAddress ?? AddressZero) as Address,
                    path.input.address as Address,
                    path.output.address as Address,
                    path.fromBase ?? false,
                  ],
                ),
              }
            : {
                stable: false,
                callData: encodeAbiParameters(
                  parseAbiParameters('address[]'),
                  [[path.input.address, path.output.address] as Address[]],
                ),
              },
        )

        if (nativeIn) {
          methodName = 'swapExactNativeCurrencyForTokensThroughStablePool'
          args = [
            trade.minimumAmountOut(options.allowedSlippage).quotient.toString(),
            paths,
            options.recipient,
            deadline,
          ]
          value = trade.inputAmount.quotient.toString()
        }
        else if (nativeOut) {
          methodName = 'swapExactTokensForNativeCurrencyThroughStablePool'
          args = [
            trade.inputAmount.quotient.toString(),
            trade.minimumAmountOut(options.allowedSlippage).quotient.toString(),
            paths,
            options.recipient,
            deadline,
          ]
          value = ZERO_HEX
        }
        else {
          methodName = 'swapExactTokensForTokensThroughStablePool'
          args = [
            trade.inputAmount.quotient.toString(),
            trade.minimumAmountOut(options.allowedSlippage).quotient.toString(),
            paths,
            options.recipient,
            deadline,
          ]
          value = ZERO_HEX
        }
      }
      else {
        if (nativeIn) {
          methodName = 'swapExactNativeCurrencyForTokens'
          args = [
            trade.minimumAmountOut(options.allowedSlippage).quotient.toString(),
            trade.route.tokenPath.map(token => token.address),
            options.recipient,
            deadline,
          ]
          value = trade.inputAmount.quotient.toString()
        }
        else if (nativeOut) {
          methodName = 'swapExactTokensForNativeCurrency'
          args = [
            trade.inputAmount.quotient.toString(),
            trade.minimumAmountOut(options.allowedSlippage).quotient.toString(),
            trade.route.tokenPath.map(token => token.address),
            options.recipient,
            deadline,
          ]
          value = ZERO_HEX
        }
        else {
          methodName = 'swapExactTokensForTokens'
          args = [
            trade.inputAmount.quotient.toString(),
            trade.minimumAmountOut(options.allowedSlippage).quotient.toString(),
            trade.route.tokenPath.map(token => token.address),
            options.recipient,
            deadline,
          ]
          value = ZERO_HEX
        }
      }

      return {
        methodName,
        args,
        value,
      }
    }
    else {
      const nativeIn = trade.inputAmount.currency.isNative
      if (options.isToUsePermit2) {
        if (options.signature && options.permitSingle) {
          return {
            methodName: 'swapWithPermit2Signature',
            args: [
              ...trade.writeArgs,
              options.permitSingle,
              options.signature,
            ],
            value: nativeIn ? trade.inputAmount.quotient.toString() : ZERO_HEX,
          }
        }
        else {
          return {
            methodName: 'swapWithPermit2',
            args: trade.writeArgs,
            value: nativeIn ? trade.inputAmount.quotient.toString() : ZERO_HEX,
          }
        }
      }
      return {
        methodName: trade.callMethod,
        args: trade.writeArgs,
        value: nativeIn ? trade.inputAmount.quotient.toString() : ZERO_HEX,
      }
    }
  }
}
