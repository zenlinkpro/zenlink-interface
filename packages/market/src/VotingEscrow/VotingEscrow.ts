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

export class VotingEscrow {
  private readonly WEEK = JSBI.BigInt(86400 * 7)
  private readonly MIN_LOCK_TIME = this.WEEK // 1 weeks
  private readonly MAX_LOCK_TIME = JSBI.multiply(this.WEEK, JSBI.BigInt(104)) // 104 weeks
  private readonly position: LockedPosition
  private readonly veBalance: VeBalance

  public constructor(position: LockedPosition) {
    this.position = position
    this.veBalance = this._convertToVeBalance(this.position)
  }

  private _isExpired(a: VeBalance): boolean {
    return JSBI.greaterThanOrEqual(JSBI.multiply(a.slope, getCurrentTime()), a.bias)
  }

  private _isPositionExpired(position: LockedPosition): boolean {
    return JSBI.lessThanOrEqual(position.expiry, getCurrentTime())
  }

  private _getValueAt(a: VeBalance, t: JSBI): JSBI {
    if (JSBI.greaterThan(JSBI.multiply(a.slope, t), a.bias))
      return ZERO
    return JSBI.subtract(a.bias, JSBI.multiply(a.slope, t))
  }

  private _getCurrentValue(a: VeBalance): JSBI {
    if (this._isExpired(a))
      return ZERO
    return this._getValueAt(a, getCurrentTime())
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

  public get getRedeemableAmount(): JSBI {
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
