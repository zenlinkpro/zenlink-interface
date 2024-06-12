import type { Token } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import { type VotingEscrow, getWeekStartUnixTime } from '@zenlink-interface/market'
import { JSBI, ZERO } from '@zenlink-interface/math'
import { addWeeks, fromUnixTime, getUnixTime } from 'date-fns'
import type { Duration } from 'lib/types'
import { useMemo } from 'react'

export function useIncreaseLockPosition(
  ve: VotingEscrow | undefined,
  amount: Amount<Token>,
  additionalDurationToLock: Duration,
): { newVeBalance: Amount<Token>, newExpiry: number } | undefined {
  return useMemo(() => {
    if (!ve)
      return undefined

    const currentExpiry = ve.currentPositionExpiry
      ? JSBI.toNumber(ve.currentPositionExpiry)
      : getWeekStartUnixTime()

    const newExpiry = getUnixTime(addWeeks(fromUnixTime(currentExpiry), additionalDurationToLock))
    let newVeBalance: JSBI | undefined

    try {
      newVeBalance = ve.getIncreaseLockPosition(amount, JSBI.BigInt(newExpiry))
    }
    catch {
      newVeBalance = undefined
    }

    return {
      newVeBalance: Amount.fromRawAmount(amount.currency, newVeBalance || ZERO),
      newExpiry,
    }
  }, [additionalDurationToLock, amount, ve])
}
