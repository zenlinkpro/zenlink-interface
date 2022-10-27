import type { Amount, Token } from '@zenlink-interface/currency'
import invariant from 'tiny-invariant'
import type { Trade } from './Trade'

interface InputOutput {
  readonly inputAmount: Amount<Token>
  readonly outputAmount: Amount<Token>
}

// comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first
export function inputOutputComparator(a: InputOutput, b: InputOutput): number {
  // must have same input and output token for comparison
  invariant(a.inputAmount.currency.equals(b.inputAmount.currency), 'INPUT_CURRENCY')
  invariant(a.outputAmount.currency.equals(b.outputAmount.currency), 'OUTPUT_CURRENCY')

  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount))
      return 0

    // trade A requires less input than trade B, so A should come first
    if (a.inputAmount.lessThan(b.inputAmount))
      return -1

    else
      return 1
  }
  else {
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount))
      return 1

    else
      return -1
  }
}

export function tradeComparator(a: Trade, b: Trade): number {
  const ioComp = inputOutputComparator(a, b)

  if (ioComp !== 0)
    return ioComp

  // consider lowest slippage next, since these are less likely to fail
  if (a.priceImpact.lessThan(b.priceImpact))
    return -1

  else if (a.priceImpact.greaterThan(b.priceImpact))
    return 1

  return a.route.routePath.length - b.route.routePath.length
}
