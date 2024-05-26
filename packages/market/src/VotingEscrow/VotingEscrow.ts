import type { Amount, Token } from '@zenlink-interface/currency'
import { JSBI, ZERO } from '@zenlink-interface/math'
import { getUnixTime } from 'date-fns'
import invariant from 'tiny-invariant'

export interface VeBalance {
  bias: JSBI
  slope: JSBI
}

export interface LockedPosition {
  amount: JSBI
  expiry: JSBI
}

function getCurrentTime(): JSBI {
  return JSBI.BigInt(getUnixTime(Date.now()))
}

export const WEEK = JSBI.BigInt(86400 * 7)
export const MIN_LOCK_TIME = WEEK // 1 weeks
export const MAX_LOCK_TIME = JSBI.multiply(WEEK, JSBI.BigInt(104)) // 104 weeks

export class VotingEscrow {
  private readonly WEEK = WEEK
  private readonly MIN_LOCK_TIME = MIN_LOCK_TIME // 1 weeks
  private readonly MAX_LOCK_TIME = MAX_LOCK_TIME // 104 weeks
  private readonly position: LockedPosition
  private readonly veBalance: VeBalance
  public readonly totalSupplyAmount: JSBI

  public constructor(position: LockedPosition, totalSupplyAmount: JSBI) {
    this.position = position
    this.veBalance = this._convertToVeBalance(this.position)
    this.totalSupplyAmount = totalSupplyAmount
  }

  public static add(a: VeBalance, b: VeBalance): VeBalance {
    return {
      bias: JSBI.add(a.bias, b.bias),
      slope: JSBI.add(a.slope, b.slope),
    }
  }

  public static sub(a: VeBalance, b: VeBalance): VeBalance {
    return {
      bias: JSBI.subtract(a.bias, b.bias),
      slope: JSBI.subtract(a.slope, b.slope),
    }
  }

  public static getValue(a: VeBalance): JSBI {
    if (VotingEscrow.isExpired(a))
      return ZERO
    return this.getValueAt(a, getCurrentTime())
  }

  public static isExpired(a: VeBalance): boolean {
    return JSBI.greaterThanOrEqual(JSBI.multiply(a.slope, getCurrentTime()), a.bias)
  }

  public static getValueAt(a: VeBalance, t: JSBI): JSBI {
    if (JSBI.greaterThan(JSBI.multiply(a.slope, t), a.bias))
      return ZERO
    return JSBI.subtract(a.bias, JSBI.multiply(a.slope, t))
  }

  private _isPositionExpired(position: LockedPosition): boolean {
    return JSBI.lessThanOrEqual(position.expiry, getCurrentTime())
  }

  private _getCurrentValue(a: VeBalance): JSBI {
    if (VotingEscrow.isExpired(a))
      return ZERO
    return VotingEscrow.getValueAt(a, getCurrentTime())
  }

  private _getExpiry(a: VeBalance): JSBI | undefined {
    if (JSBI.equal(a.slope, ZERO))
      return undefined
    return JSBI.divide(a.bias, a.slope)
  }

  private _convertToVeBalance(position: LockedPosition): VeBalance {
    const slope = JSBI.divide(position.amount, this.MAX_LOCK_TIME)
    return {
      slope,
      bias: JSBI.multiply(slope, position.expiry),
    }
  }

  public get balance(): JSBI {
    return this._getCurrentValue(this.veBalance)
  }

  public get currentPositionExpiry(): JSBI | undefined {
    return this._getExpiry(this.veBalance)
  }

  public get isCurrentExpired(): boolean {
    return this._isPositionExpired(this.position)
  }

  public get lockedAmount(): JSBI {
    return this.position.amount
  }

  public get redeemableAmount(): JSBI {
    if (!this._isPositionExpired(this.position))
      return ZERO
    return this.position.amount
  }

  public getIncreaseLockPosition(additionalAmountToLock: Amount<Token>, newExpiry: JSBI): JSBI {
    invariant(JSBI.equal(JSBI.remainder(newExpiry, this.WEEK), ZERO), 'InvalidWTime')
    invariant(JSBI.greaterThan(newExpiry, getCurrentTime()), 'ExpiryInThePast')
    invariant(JSBI.greaterThanOrEqual(newExpiry, this.position.expiry), 'VENotAllowedReduceExpiry')
    invariant(JSBI.lessThanOrEqual(newExpiry, JSBI.add(getCurrentTime(), this.MAX_LOCK_TIME)), 'VEExceededMaxLockTime')
    invariant(JSBI.greaterThanOrEqual(newExpiry, JSBI.add(getCurrentTime(), this.MIN_LOCK_TIME)), 'VEInsufficientLockTime')

    const newTotalAmountLocked = JSBI.add(additionalAmountToLock.quotient, this.position.amount)
    invariant(JSBI.greaterThan(newTotalAmountLocked, ZERO), 'VEZeroAmountLocked')

    const additionalDurationToLock = JSBI.subtract(newExpiry, this.position.expiry)
    const oldPosition = { ...this.position }
    const newPosition: LockedPosition = {
      amount: JSBI.add(oldPosition.amount, additionalAmountToLock.quotient),
      expiry: JSBI.add(oldPosition.expiry, additionalDurationToLock),
    }
    const newBalance = this._convertToVeBalance(newPosition)
    return this._getCurrentValue(newBalance)
  }
}
