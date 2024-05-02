import invariant from 'tiny-invariant'
import { Amount, Price, Token } from '@zenlink-interface/currency'
import { JSBI, ZERO, _1e18, sqrt } from '@zenlink-interface/math'
import { getUnixTime } from 'date-fns'
import type { PT, SYBase, YT } from '../Token'
import { assetToSy, assetToSyUp, isCurrentExpired, syToAsset } from '../utils'
import { InsufficientInputAmountError } from '../errors'

export interface MarketState {
  totalPt: Amount<Token>
  totalSy: Amount<Token>
  totalLp: Amount<Token>
  scalarRoot: JSBI
  lnFeeRateRoot: JSBI
  reserveFeePercent: JSBI
  lastLnImpliedRate: JSBI
}

export interface MarketPreCompute {
  rateScalar: JSBI
  totalAsset: JSBI
  rateAnchor: JSBI
  feeRate: JSBI
}

const EMPTY_MARKET_PRE_COMPUTE: MarketPreCompute = {
  rateScalar: ZERO,
  totalAsset: ZERO,
  rateAnchor: ZERO,
  feeRate: ZERO,
}

export class Market extends Token {
  public readonly id: string
  public readonly PT: PT
  public readonly SY: SYBase
  public readonly YT: YT
  public readonly expiry: JSBI
  public marketState: MarketState
  public readonly minLiquidity = JSBI.BigInt(1000)
  public readonly PERCENTAGE_DECIMALS = JSBI.BigInt(100)
  private readonly DAY = JSBI.BigInt(86400)
  private readonly IMPLIED_RATE_TIME = JSBI.BigInt(365 * 86400)

  public constructor(
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

  public isSY(token: Token): boolean {
    return this.SY.equals(token)
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

  private _getRateScalar(timeToExpiry: JSBI): JSBI {
    return JSBI.divide(
      JSBI.multiply(this.marketState.scalarRoot, this.IMPLIED_RATE_TIME),
      timeToExpiry,
    )
  }

  private _getExchangeRateFromImpliedRate(lnImpliedRate: JSBI, timeToExpiry: JSBI): JSBI {
    const rt = JSBI.divide(JSBI.multiply(lnImpliedRate, timeToExpiry), this.IMPLIED_RATE_TIME)
    return JSBI.BigInt(
      Number.parseInt(
        Math.exp(Number.parseInt(rt.toString())).toString(),
      ),
    )
  }

  private _getRateAnchor(
    totalPt: JSBI,
    lastLnImpliedRate: JSBI,
    totalAsset: JSBI,
    rateScalar: JSBI,
    timeToExpiry: JSBI,
  ): JSBI {
    const newExchangeRate = this._getExchangeRateFromImpliedRate(lastLnImpliedRate, timeToExpiry)
    invariant(JSBI.lessThan(newExchangeRate, _1e18), 'RATE')

    const proportion = JSBI.divide(totalPt, JSBI.add(totalPt, totalAsset))
    const lnProportion = this._logProportion(proportion)
    return JSBI.subtract(newExchangeRate, JSBI.divide(lnProportion, rateScalar))
  }

  private _logProportion(proportion: JSBI): JSBI {
    const logitP = JSBI.divide(proportion, JSBI.subtract(_1e18, proportion))
    return JSBI.BigInt(
      Number.parseInt(
        Math.log(Number.parseInt(logitP.toString())).toString(),
      ),
    )
  }

  private _getExchangeRate(
    totalPt: JSBI,
    totalAsset: JSBI,
    rateScalar: JSBI,
    rateAnchor: JSBI,
    netPtToAccount: JSBI,
  ): JSBI {
    const numerator = JSBI.subtract(totalPt, netPtToAccount)
    const proportion = JSBI.divide(numerator, JSBI.add(totalPt, totalAsset))
    const lnProportion = this._logProportion(proportion)
    const exchangeRate = JSBI.add(JSBI.divide(lnProportion, rateScalar), rateAnchor)
    invariant(JSBI.GE(exchangeRate, _1e18), 'EXCHANGE_RATE')
    return exchangeRate
  }

  private getMarketPreCompute(market: MarketState, index: JSBI, time: JSBI): MarketPreCompute {
    invariant(!this.isExpired, 'EXPIRED')
    const timeToExpiry = JSBI.subtract(this.expiry, time)
    const res = EMPTY_MARKET_PRE_COMPUTE
    res.rateScalar = this._getRateScalar(timeToExpiry)
    res.totalAsset = syToAsset(index, market.totalSy.quotient)
    invariant(JSBI.GT(market.totalPt.quotient, ZERO) && JSBI.greaterThan(res.totalAsset, ZERO), 'RESERVE')
    res.rateAnchor = this._getRateAnchor(
      market.totalPt.quotient,
      market.lastLnImpliedRate,
      res.totalAsset,
      res.rateScalar,
      timeToExpiry,
    )
    res.feeRate = this._getExchangeRateFromImpliedRate(market.lnFeeRateRoot, timeToExpiry)
    return res
  }

  private calcTrade(
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
    const preFeeAssetToAccount = JSBI.subtract(ZERO, JSBI.divide(netPtToAccount, preFeeExchangeRate))
    let fee = comp.feeRate

    if (JSBI.GT(netPtToAccount, ZERO)) {
      const postFeeExchangeRate = JSBI.divide(preFeeExchangeRate, fee)
      invariant(JSBI.GE(postFeeExchangeRate, _1e18), 'EXCHAGE_RATE')
      fee = JSBI.multiply(preFeeAssetToAccount, JSBI.subtract(_1e18, fee))
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

    const netAssetToReserve = JSBI.divide(JSBI.multiply(fee, market.reserveFeePercent), this.PERCENTAGE_DECIMALS)
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
    invariant(JSBI.GT(this.marketState.totalPt, exactPtIn), 'RESERVE')

    const index = this.YT.pyIndexCurrent
    const currentTime = JSBI.BigInt(getUnixTime(Date.now()))
    const comp = this.getMarketPreCompute(this.marketState, index, currentTime)
    const { netSyToAccount } = this.calcTrade(this.marketState, comp, index, exactPtIn)

    return Amount.fromRawAmount(this.SY, netSyToAccount)
  }

  public getSwapSyToExactPt(exactPtOutAmount: Amount<Token>): Amount<Token> {
    invariant(this.isPT(exactPtOutAmount.currency), 'TOKEN')
    invariant(!this.isExpired, 'EXPIRED')

    const exactPtOut = exactPtOutAmount.quotient
    invariant(JSBI.GT(this.marketState.totalPt, exactPtOut), 'RESERVE')

    const index = this.YT.pyIndexCurrent
    const currentTime = JSBI.BigInt(getUnixTime(Date.now()))
    const comp = this.getMarketPreCompute(this.marketState, index, currentTime)
    const { netSyToAccount: netSyToMarket } = this.calcTrade(this.marketState, comp, index, exactPtOut)

    return Amount.fromRawAmount(this.SY, netSyToMarket)
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
}
