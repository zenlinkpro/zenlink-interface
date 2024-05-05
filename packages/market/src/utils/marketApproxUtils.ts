import { JSBI, ONE, TWO, ZERO, _1000, _1e18, _999, maximum, minimum } from '@zenlink-interface/math'
import invariant from 'tiny-invariant'
import type { Market, MarketPreCompute, MarketState } from '../Market'
import { ApproxFailError } from '../errors'
import { divDown, mulDown } from './math'
import { assetToSyUp, syToAsset } from './syUtils'

export interface ApproxParams {
  guessMin: JSBI
  guessMax: JSBI
  guessOffchain: JSBI
  maxIteration: number
  eps: JSBI
}

function calcSlope(comp: MarketPreCompute, totalPt: JSBI, ptToMarket: JSBI): JSBI {
  const diffAssetPtToMarket = JSBI.subtract(comp.totalAsset, ptToMarket)
  const sumPt = JSBI.add(ptToMarket, totalPt)
  invariant(JSBI.GT(diffAssetPtToMarket, ZERO) && JSBI.GT(sumPt, ZERO), 'INVALID_PTTOMARKET')
  const part1 = divDown(
    JSBI.multiply(ptToMarket, JSBI.add(totalPt, comp.totalAsset)),
    JSBI.multiply(sumPt, diffAssetPtToMarket),
  )
  const part2 = JSBI.BigInt(
    Number.parseInt(
      Math.log(Number.parseInt(divDown(sumPt, diffAssetPtToMarket).toString())).toString(),
    ),
  )
  const part3 = divDown(_1e18, comp.rateScalar)

  return JSBI.subtract(
    comp.rateAnchor,
    mulDown(JSBI.subtract(part1, part2), part3),
  )
}

function calcMaxPtIn(market: MarketState, comp: MarketPreCompute): JSBI {
  let low = ZERO
  let hi = JSBI.subtract(comp.totalAsset, ONE)
  while (JSBI.notEqual(low, hi)) {
    const mid = JSBI.divide(JSBI.add(JSBI.add(low, hi), ONE), TWO)
    if (JSBI.LT(calcSlope(comp, market.totalPt.quotient, mid), ZERO))
      hi = JSBI.subtract(mid, ONE)
    else
      low = mid
  }
  return low
}

function calcMaxPtOut(comp: MarketPreCompute, totalPt: JSBI): JSBI {
  const logitP = JSBI.BigInt(
    Math.exp(
      Number.parseInt(
        mulDown(JSBI.subtract(comp.feeRate, comp.rateAnchor), comp.rateScalar).toString(),
      ),
    ),
  )
  const proportion = divDown(logitP, JSBI.add(logitP, _1e18))
  const numerator = mulDown(proportion, JSBI.add(totalPt, comp.totalAsset))
  const maxPtOut = JSBI.subtract(totalPt, numerator)
  return JSBI.divide(JSBI.multiply(maxPtOut, _999), _1000)
}

function validateApprox(approx: ApproxParams) {
  invariant(JSBI.GE(approx.guessMax, approx.guessMin) && JSBI.LE(approx.eps, _1e18), 'APPROX_INVALID')
}

function nextGuess(approx: ApproxParams, iter: number): JSBI {
  if (iter === 0 && !JSBI.EQ(approx.guessOffchain, ZERO))
    return approx.guessOffchain
  if (JSBI.LE(approx.guessMin, approx.guessMax))
    return JSBI.divide(JSBI.add(approx.guessMin, approx.guessMax), TWO)
  throw ApproxFailError
}

function calcSyIn(
  market: Market,
  comp: MarketPreCompute,
  index: JSBI,
  netPtOut: JSBI,
): { netSyIn: JSBI, netSyFee: JSBI, netSyToReserve: JSBI } {
  const { netSyToAccount, netSyToReserve, netSyFee } = market.calcTrade(
    market.marketState,
    comp,
    index,
    netPtOut,
  )

  return {
    netSyIn: JSBI.subtract(ZERO, netSyToAccount),
    netSyFee,
    netSyToReserve,
  }
}

function calcSyOut(
  market: Market,
  comp: MarketPreCompute,
  index: JSBI,
  netPtIn: JSBI,
): { netSyOut: JSBI, netSyFee: JSBI, netSyToReserve: JSBI } {
  const { netSyToAccount, netSyToReserve, netSyFee } = market.calcTrade(
    market.marketState,
    comp,
    index,
    JSBI.subtract(ZERO, netPtIn),
  )

  return {
    netSyOut: netSyToAccount,
    netSyFee,
    netSyToReserve,
  }
}

function isASmallerApproxB(a: JSBI, b: JSBI, eps: JSBI): boolean {
  return JSBI.LE(a, b) && JSBI.GE(a, mulDown(b, JSBI.subtract(_1e18, eps)))
}

export function approxSwapExactSyForPt(
  market: Market,
  index: JSBI,
  exactSyIn: JSBI,
  blockTime: JSBI,
  approx: ApproxParams,
): { netPtOut: JSBI, netSyFee: JSBI } {
  const comp = market.getMarketPreCompute(index, blockTime)
  if (JSBI.EQ(approx.guessOffchain, ZERO)) {
    approx.guessMax = maximum(approx.guessMax, calcMaxPtOut(comp, market.marketState.totalPt.quotient))
    validateApprox(approx)
  }
  for (let i = 0; i < approx.maxIteration; i++) {
    const guess = nextGuess(approx, i)
    const { netSyIn, netSyFee } = calcSyIn(market, comp, index, guess)
    if (JSBI.LE(netSyIn, exactSyIn)) {
      if (isASmallerApproxB(netSyIn, exactSyIn, approx.eps))
        return { netPtOut: guess, netSyFee }
      approx.guessMin = guess
    }
    else {
      approx.guessMax = JSBI.subtract(guess, ONE)
    }
  }
  throw ApproxFailError
}

export function approxSwapExactSyForYt(
  market: Market,
  index: JSBI,
  exactSyIn: JSBI,
  blockTime: JSBI,
  approx: ApproxParams,
): { netYtOut: JSBI, netSyFee: JSBI } {
  const comp = market.getMarketPreCompute(index, blockTime)
  if (JSBI.EQ(approx.guessOffchain, ZERO)) {
    approx.guessMin = maximum(approx.guessMin, syToAsset(index, exactSyIn))
    approx.guessMax = minimum(approx.guessMax, calcMaxPtIn(market.marketState, comp))
    validateApprox(approx)
  }
  for (let i = 0; i < approx.maxIteration; i++) {
    const guess = nextGuess(approx, i)
    const { netSyOut, netSyFee } = calcSyOut(market, comp, index, guess)
    const netSyToTokenizePt = assetToSyUp(index, guess)
    const netSyToPull = JSBI.subtract(netSyToTokenizePt, netSyOut)
    if (JSBI.LE(netSyToPull, exactSyIn)) {
      if (isASmallerApproxB(netSyToPull, exactSyIn, approx.eps))
        return { netYtOut: guess, netSyFee }
      approx.guessMin = guess
    }
    else {
      approx.guessMax = JSBI.subtract(guess, ONE)
    }
  }
  throw ApproxFailError
}
