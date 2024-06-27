import invariant from 'tiny-invariant'
import { Amount, Price, Token } from '@zenlink-interface/currency'
import { JSBI, MAX_UINT256, ONE, TWELVE, ZERO, _1e15, _1e18, minimum, sqrt } from '@zenlink-interface/math'
import { getUnixTime } from 'date-fns'
import type { PT, SYBase, YT } from '../Token'
import {
  approxSwapExactPtForYt,
  approxSwapExactSyForPt,
  approxSwapExactSyForYt,
  approxSwapExactYtForPt,
  approxSwapSyToAddLiquidity,
  assetToSy,
  assetToSyUp,
  divDown,
  exp,
  isCurrentExpired,
  ln,
  mulDown,
  syToAsset,
  syToAssetUp,
} from '../utils'
import { InsufficientInputAmountError } from '../errors'
import { MAX_LOCK_TIME, WEEK } from '../VotingEscrow'

export interface MarketState {
  totalPt: Amount<Token>
  totalSy: Amount<Token>
  totalLp: Amount<Token>
  scalarRoot: JSBI
  lnFeeRateRoot: JSBI
  reserveFeePercent: JSBI
  lastLnImpliedRate: JSBI
  totalActiveSupply: JSBI
}

export interface MarketPreCompute {
  rateScalar: JSBI
  totalAsset: JSBI
  rateAnchor: JSBI
  feeRate: JSBI
}

export interface ApproxParams {
  guessMin: JSBI
  guessMax: JSBI
  guessOffchain: JSBI
  maxIteration: number
  eps: JSBI
}

export interface MarketRewardData {
  zlkPerSec: JSBI
  accumulatedZLK: JSBI
  lastUpdated: JSBI
  incentiveEndsAt: JSBI
}

const EMPTY_MARKET_PRE_COMPUTE: MarketPreCompute = {
  rateScalar: ZERO,
  totalAsset: ZERO,
  rateAnchor: ZERO,
  feeRate: ZERO,
}

const DEFAULT_MARKET_APPROX_PARAMS: ApproxParams = {
  guessMin: ZERO,
  guessMax: MAX_UINT256,
  guessOffchain: ZERO,
  maxIteration: 256,
  eps: _1e15,
}

export class Market extends Token {
  public readonly id: string
  public readonly projectName: string
  public readonly PT: PT
  public readonly SY: SYBase
  public readonly YT: YT
  public readonly expiry: JSBI
  public marketState: MarketState
  public readonly minLiquidity = JSBI.BigInt(1000)
  public readonly PERCENTAGE_DECIMALS = JSBI.BigInt(100)
  private readonly DAY = JSBI.BigInt(86400)
  private readonly IMPLIED_RATE_TIME = JSBI.multiply(JSBI.BigInt(365), this.DAY)

  public constructor(
    projectName: string,
    token: {
      chainId: number | string
      address: string
      decimals: number
      symbol?: string
      name?: string
    },
    PT: PT,
  ) {
    super(token)
    this.id = token.address
    this.projectName = projectName
    this.PT = PT
    this.SY = this.PT.SY
    invariant(this.PT.YT, 'YT_NOT_INITIALIZED')
    this.YT = this.PT.YT
    this.expiry = this.PT.expiry
    this.marketState = {
      totalPt: Amount.fromRawAmount(this.PT, ZERO),
      totalSy: Amount.fromRawAmount(this.SY, ZERO),
      totalLp: Amount.fromRawAmount(this, ZERO),
      scalarRoot: ZERO,
      lnFeeRateRoot: ZERO,
      reserveFeePercent: ZERO,
      lastLnImpliedRate: ZERO,
      totalActiveSupply: ZERO,
    }
  }

  public updateMarketState(marketState: MarketState) {
    this.marketState = marketState
  }

  public get isExpired(): boolean {
    return isCurrentExpired(this.expiry)
  }

  public isPT(token: Token): boolean {
    return this.PT.equals(token)
  }

  public isYT(token: Token): boolean {
    return this.YT.equals(token)
  }

  public isSY(token: Token): boolean {
    return this.SY.equals(token)
  }

  public isYieldToken(token: Token): boolean {
    return this.SY.yieldToken.equals(token)
  }

  public isTokenIncludedInMarket(token: Token): boolean {
    return this.isPT(token) || this.isYT(token) || this.isSY(token) || this.isYieldToken(token)
  }

  public get ptPrice(): Price<Token, Token> {
    const result = this.marketState.totalSy.divide(this.marketState.totalPt)
    return new Price(this.PT, this.SY, result.denominator, result.numerator)
  }

  public get syPrice(): Price<Token, Token> {
    const result = this.marketState.totalPt.divide(this.marketState.totalSy)
    return new Price(this.SY, this.PT, result.denominator, result.numerator)
  }

  public priceOf(token: Token): Price<Token, Token> {
    invariant(this.isPT(token) || this.isSY(token), 'TOKEN')
    return token.equals(this.PT) ? this.ptPrice : this.syPrice
  }

  public calcPendingRewards(
    marketRewardData: MarketRewardData | undefined,
    tokenRewardIndex: JSBI,
    tokenUserIndex: JSBI,
    userActiveBalance: JSBI,
  ): JSBI {
    let accrued = ZERO
    if (marketRewardData) {
      const now = getUnixTime(Date.now())
      const newLastUpdated = minimum(JSBI.BigInt(now), marketRewardData.incentiveEndsAt)
      accrued = JSBI.add(
        marketRewardData.accumulatedZLK,
        JSBI.multiply(marketRewardData.zlkPerSec, JSBI.subtract(newLastUpdated, marketRewardData.lastUpdated)),
      )
    }

    let index = tokenRewardIndex
    if (JSBI.greaterThan(this.marketState.totalActiveSupply, ZERO))
      index = JSBI.add(index, divDown(accrued, this.marketState.totalActiveSupply))

    if (JSBI.equal(index, ONE) || JSBI.equal(index, tokenUserIndex))
      return ZERO
    return mulDown(userActiveBalance, JSBI.subtract(index, tokenUserIndex))
  }

  public calcMaxBoostZLkAmount(lpToMint: Amount<Token>, veTotalSupply: JSBI): [JSBI, JSBI, JSBI] {
    if (lpToMint.equalTo(0))
      return [ZERO, ZERO, ZERO]

    const veZLK = JSBI.divide(
      JSBI.multiply(lpToMint.quotient, veTotalSupply),
      this.marketState.totalLp.add(lpToMint).quotient,
    )

    const threeMonths = JSBI.multiply(WEEK, TWELVE)
    const oneYear = JSBI.multiply(WEEK, JSBI.BigInt(51))
    const twoYears = JSBI.multiply(WEEK, JSBI.BigInt(102))

    return [
      JSBI.divide(JSBI.multiply(veZLK, MAX_LOCK_TIME), threeMonths),
      JSBI.divide(JSBI.multiply(veZLK, MAX_LOCK_TIME), oneYear),
      JSBI.divide(JSBI.multiply(veZLK, MAX_LOCK_TIME), twoYears),
    ]
  }

  private _getRateScalar(timeToExpiry: JSBI): JSBI {
    const rateScalar = JSBI.divide(
      JSBI.multiply(this.marketState.scalarRoot, this.IMPLIED_RATE_TIME),
      timeToExpiry,
    )
    invariant(JSBI.GT(rateScalar, ZERO), 'RateScalarBelowZero')
    return rateScalar
  }

  private _getExchangeRateFromImpliedRate(lnImpliedRate: JSBI, timeToExpiry: JSBI): JSBI {
    const rt = JSBI.divide(JSBI.multiply(lnImpliedRate, timeToExpiry), this.IMPLIED_RATE_TIME)
    return exp(rt)
  }

  private _getRateAnchor(
    totalPt: JSBI,
    lastLnImpliedRate: JSBI,
    totalAsset: JSBI,
    rateScalar: JSBI,
    timeToExpiry: JSBI,
  ): JSBI {
    const newExchangeRate = this._getExchangeRateFromImpliedRate(lastLnImpliedRate, timeToExpiry)
    invariant(JSBI.GE(newExchangeRate, _1e18), 'RATE')

    const proportion = divDown(totalPt, JSBI.add(totalPt, totalAsset))
    const lnProportion = this._logProportion(proportion)
    return JSBI.subtract(newExchangeRate, divDown(lnProportion, rateScalar))
  }

  private _logProportion(proportion: JSBI): JSBI {
    invariant(JSBI.notEqual(proportion, _1e18), 'ProportionMustNotEqualOne')
    const logitP = divDown(proportion, JSBI.subtract(_1e18, proportion))
    return ln(logitP)
  }

  private _getExchangeRate(
    totalPt: JSBI,
    totalAsset: JSBI,
    rateScalar: JSBI,
    rateAnchor: JSBI,
    netPtToAccount: JSBI,
  ): JSBI {
    const numerator = JSBI.subtract(totalPt, netPtToAccount)
    const proportion = divDown(numerator, JSBI.add(totalPt, totalAsset))
    const lnProportion = this._logProportion(proportion)
    const exchangeRate = JSBI.add(divDown(lnProportion, rateScalar), rateAnchor)
    invariant(JSBI.GE(exchangeRate, _1e18), 'EXCHANGE_RATE')
    return exchangeRate
  }

  public getMarketPreCompute(index: JSBI, time: JSBI): MarketPreCompute {
    invariant(!this.isExpired, 'EXPIRED')
    const timeToExpiry = JSBI.subtract(this.expiry, time)
    const res = { ...EMPTY_MARKET_PRE_COMPUTE }
    res.rateScalar = this._getRateScalar(timeToExpiry)
    res.totalAsset = syToAsset(index, this.marketState.totalSy.quotient)

    invariant(
      JSBI.GT(this.marketState.totalPt.quotient, ZERO) && JSBI.greaterThan(res.totalAsset, ZERO),
      'RESERVE',
    )

    res.rateAnchor = this._getRateAnchor(
      this.marketState.totalPt.quotient,
      this.marketState.lastLnImpliedRate,
      res.totalAsset,
      res.rateScalar,
      timeToExpiry,
    )
    res.feeRate = this._getExchangeRateFromImpliedRate(this.marketState.lnFeeRateRoot, timeToExpiry)
    return res
  }

  public calcTrade(
    market: MarketState,
    comp: MarketPreCompute,
    index: JSBI,
    netPtToAccount: JSBI,
  ): { netSyToAccount: JSBI, netSyFee: JSBI, netSyToReserve: JSBI } {
    const preFeeExchangeRate = this._getExchangeRate(
      market.totalPt.quotient,
      comp.totalAsset,
      comp.rateScalar,
      comp.rateAnchor,
      netPtToAccount,
    )
    const preFeeAssetToAccount = JSBI.subtract(ZERO, divDown(netPtToAccount, preFeeExchangeRate))
    let fee = comp.feeRate

    if (JSBI.GT(netPtToAccount, ZERO)) {
      const postFeeExchangeRate = divDown(preFeeExchangeRate, fee)
      invariant(JSBI.GE(postFeeExchangeRate, _1e18), 'EXCHAGE_RATE')
      fee = mulDown(preFeeAssetToAccount, JSBI.subtract(_1e18, fee))
    }
    else {
      fee = JSBI.subtract(
        ZERO,
        JSBI.divide(
          JSBI.multiply(preFeeAssetToAccount, JSBI.subtract(_1e18, fee)),
          fee,
        ),
      )
    }

    const netAssetToReserve = JSBI.divide(
      JSBI.multiply(fee, market.reserveFeePercent),
      this.PERCENTAGE_DECIMALS,
    )
    const netAssetToAccount = JSBI.subtract(preFeeAssetToAccount, fee)

    const netSyToAccount = JSBI.LT(netAssetToAccount, ZERO)
      ? assetToSyUp(index, netAssetToAccount)
      : assetToSy(index, netAssetToAccount)
    const netSyFee = assetToSy(index, fee)
    const netSyToReserve = assetToSy(index, netAssetToReserve)
    return { netSyToAccount, netSyFee, netSyToReserve }
  }

  public getSwapExactPtForSy(exactPtInAmount: Amount<Token>): Amount<Token> {
    invariant(this.isPT(exactPtInAmount.currency), 'TOKEN')
    invariant(!this.isExpired, 'EXPIRED')

    const exactPtIn = JSBI.subtract(ZERO, exactPtInAmount.quotient)
    invariant(JSBI.GT(this.marketState.totalPt.quotient, exactPtIn), 'RESERVE')

    const index = this.YT.pyIndexCurrent
    const currentTime = JSBI.BigInt(getUnixTime(Date.now()))
    const comp = this.getMarketPreCompute(index, currentTime)
    const { netSyToAccount } = this.calcTrade(this.marketState, comp, index, exactPtIn)

    return Amount.fromRawAmount(this.SY, netSyToAccount)
  }

  public getSwapSyForExactPt(exactPtOutAmount: Amount<Token>): Amount<Token> {
    invariant(this.isPT(exactPtOutAmount.currency), 'TOKEN')
    invariant(!this.isExpired, 'EXPIRED')

    const exactPtOut = exactPtOutAmount.quotient
    invariant(JSBI.GT(this.marketState.totalPt.quotient, exactPtOut), 'RESERVE')

    const index = this.YT.pyIndexCurrent
    const currentTime = JSBI.BigInt(getUnixTime(Date.now()))
    const comp = this.getMarketPreCompute(index, currentTime)
    const { netSyToAccount: netSyToMarket } = this.calcTrade(this.marketState, comp, index, exactPtOut)

    return Amount.fromRawAmount(this.SY, JSBI.subtract(ZERO, netSyToMarket))
  }

  public getSwapExactSyForPt(exactSyInAmount: Amount<Token>): [Amount<Token>, JSBI] {
    invariant(this.isSY(exactSyInAmount.currency), 'TOKEN')
    invariant(!this.isExpired, 'EXPIRED')

    const index = this.YT.pyIndexCurrent
    const currentTime = JSBI.BigInt(getUnixTime(Date.now()))
    const { netPtOut, guess } = approxSwapExactSyForPt(
      this,
      index,
      exactSyInAmount.quotient,
      currentTime,
      { ...DEFAULT_MARKET_APPROX_PARAMS },
    )

    return [Amount.fromRawAmount(this.PT, netPtOut), guess]
  }

  public getSwapExactSyForYt(exactSyInAmount: Amount<Token>): [Amount<Token>, JSBI] {
    invariant(this.isSY(exactSyInAmount.currency), 'TOKEN')
    invariant(!this.isExpired, 'EXPIRED')

    const index = this.YT.pyIndexCurrent
    const currentTime = JSBI.BigInt(getUnixTime(Date.now()))
    const { netYtOut, guess } = approxSwapExactSyForYt(
      this,
      index,
      exactSyInAmount.quotient,
      currentTime,
      { ...DEFAULT_MARKET_APPROX_PARAMS },
    )

    return [Amount.fromRawAmount(this.YT, netYtOut), guess]
  }

  public getSwapExactYtForSy(exactYtInAmount: Amount<Token>): Amount<Token> {
    invariant(this.isYT(exactYtInAmount.currency), 'TOKEN')
    invariant(!this.isExpired, 'EXPIRED')

    // exactPtOut = (netYtLeft = exactYtIn)
    const netSyIn = this.getSwapSyForExactPt(Amount.fromRawAmount(this.PT, exactYtInAmount.quotient))
    const index = this.YT.pyIndexCurrent
    const amountPyToMarket = syToAssetUp(index, netSyIn.quotient)
    const amountPyToAccount = JSBI.subtract(exactYtInAmount.quotient, amountPyToMarket)
    const amountSyToAccount = assetToSy(index, amountPyToAccount)

    return Amount.fromRawAmount(this.SY, amountSyToAccount)
  }

  public getSwapExactPtForYt(exactPtInAmount: Amount<Token>): [Amount<Token>, JSBI] {
    invariant(this.isPT(exactPtInAmount.currency), 'TOKEN')
    invariant(!this.isExpired, 'EXPIRED')

    const index = this.YT.pyIndexCurrent
    const currentTime = JSBI.BigInt(getUnixTime(Date.now()))
    const { netYtOut, guess } = approxSwapExactPtForYt(
      this,
      index,
      exactPtInAmount.quotient,
      currentTime,
      { ...DEFAULT_MARKET_APPROX_PARAMS },
    )

    return [Amount.fromRawAmount(this.YT, netYtOut), guess]
  }

  public getSwapExactYtForPt(exactYtInAmount: Amount<Token>): [Amount<Token>, JSBI] {
    invariant(this.isYT(exactYtInAmount.currency), 'TOKEN')
    invariant(!this.isExpired, 'EXPIRED')

    const index = this.YT.pyIndexCurrent
    const currentTime = JSBI.BigInt(getUnixTime(Date.now()))
    const { netPtOut, guess } = approxSwapExactYtForPt(
      this,
      index,
      exactYtInAmount.quotient,
      currentTime,
      { ...DEFAULT_MARKET_APPROX_PARAMS },
    )

    return [Amount.fromRawAmount(this.PT, netPtOut), guess]
  }

  public getLiquidityMinted(syDesired: Amount<Token>, ptDesired: Amount<Token>): Amount<Token> {
    invariant(this.isSY(syDesired.currency) && this.isPT(ptDesired.currency), 'TOKEN')
    invariant(!this.isExpired, 'EXPIRED')

    let liquidity: JSBI
    if (JSBI.equal(this.marketState.totalLp.quotient, ZERO)) {
      liquidity = JSBI.subtract(
        sqrt(JSBI.multiply(syDesired.quotient, ptDesired.quotient)),
        this.minLiquidity,
      )
    }
    else {
      const netLpByPt = JSBI.divide(
        JSBI.multiply(ptDesired.quotient, this.marketState.totalLp.quotient),
        this.marketState.totalPt.quotient,
      )
      const netLpBySy = JSBI.divide(
        JSBI.multiply(syDesired.quotient, this.marketState.totalLp.quotient),
        this.marketState.totalSy.quotient,
      )
      liquidity = JSBI.lessThanOrEqual(netLpByPt, netLpBySy) ? netLpByPt : netLpBySy
    }

    if (!JSBI.greaterThan(liquidity, ZERO))
      throw new InsufficientInputAmountError()

    return Amount.fromRawAmount(this, liquidity)
  }

  public getAddLiquiditySingleSy(netSyIn: Amount<Token>): [Amount<Token>, JSBI] {
    invariant(this.isSY(netSyIn.currency), 'TOKEN')
    invariant(!this.isExpired, 'EXPIRED')

    let netSyLeft = netSyIn.quotient
    let netPtReceived = ZERO
    const index = this.YT.pyIndexCurrent
    const currentTime = JSBI.BigInt(getUnixTime(Date.now()))

    const { guess: netPtOutMarket } = approxSwapSyToAddLiquidity(
      this,
      index,
      netSyLeft,
      netPtReceived,
      currentTime,
      { ...DEFAULT_MARKET_APPROX_PARAMS },
    )

    const netSySwapMarket = this.getSwapSyForExactPt(Amount.fromRawAmount(this.PT, netPtOutMarket))
    netSyLeft = JSBI.subtract(netSyLeft, netSySwapMarket.quotient)
    netPtReceived = JSBI.add(netPtReceived, netPtOutMarket)

    return [
      this.getLiquidityMinted(
        Amount.fromRawAmount(this.SY, netSyLeft),
        Amount.fromRawAmount(this.PT, netPtReceived),
      ),
      netPtOutMarket,
    ]
  }

  public getAddLiquiditySingleSyKeepYt(netSyIn: Amount<Token>): [Amount<Token>, Amount<Token>] {
    invariant(this.isSY(netSyIn.currency), 'TOKEN')
    invariant(!this.isExpired, 'EXPIRED')

    const index = this.YT.pyIndexCurrent
    const netSyMintPy = JSBI.divide(
      JSBI.multiply(netSyIn.quotient, this.marketState.totalPt.quotient),
      JSBI.add(this.marketState.totalPt.quotient, syToAsset(index, this.marketState.totalSy.quotient)),
    )
    const netSyAddLiquidity = JSBI.subtract(netSyIn.quotient, netSyMintPy)
    const [netPtOut, netYtOut] = this.YT.getPYMinted(Amount.fromRawAmount(this.SY, netSyMintPy))
    const netLpOut = this.getLiquidityMinted(
      Amount.fromRawAmount(this.SY, netSyAddLiquidity),
      netPtOut,
    )

    return [netLpOut, netYtOut]
  }

  public getRemoveLiquiditySingleSy(netLpToRemove: Amount<Token>): Amount<Token> {
    invariant(this.equals(netLpToRemove.currency), 'TOKEN')
    invariant(netLpToRemove.lessThan(this.marketState.totalLp), 'RESERVE')

    const syFromBurn = JSBI.divide(
      JSBI.multiply(netLpToRemove.quotient, this.marketState.totalSy.quotient),
      this.marketState.totalLp.quotient,
    )
    const ptFromBurn = JSBI.divide(
      JSBI.multiply(netLpToRemove.quotient, this.marketState.totalPt.quotient),
      this.marketState.totalLp.quotient,
    )

    if (this.isExpired) {
      const syFromYTRedeem = this.YT.getPYRedeemd(
        [Amount.fromRawAmount(this.PT, ptFromBurn), Amount.fromRawAmount(this.PT, ptFromBurn)],
      )

      return Amount.fromRawAmount(
        this.SY,
        JSBI.add(syFromBurn, syFromYTRedeem.quotient),
      )
    }
    else {
      const netSyOutSwap = this.getSwapExactPtForSy(Amount.fromRawAmount(this.PT, ptFromBurn))
      return Amount.fromRawAmount(
        this.SY,
        JSBI.add(syFromBurn, netSyOutSwap.quotient),
      )
    }
  }
}
