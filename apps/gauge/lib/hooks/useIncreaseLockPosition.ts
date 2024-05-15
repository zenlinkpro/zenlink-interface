import type { Token } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import type { Duration } from 'lib/types'
import { addWeeks, fromUnixTime, getUnixTime, startOfWeek } from 'date-fns'
import { useMemo } from 'react'
import type { VotingEscrow } from '@zenlink-interface/market'
import { JSBI, ZERO } from '@zenlink-interface/math'

interface UseIncreaseLockPositionResult {
  newVeBalance: Amount<Token>
  newExpiry: number
}

export function useIncreaseLockPosition(
  ve: VotingEscrow | undefined,
  amount: Amount<Token>,
  additionalDurationToLock: Duration,
): UseIncreaseLockPositionResult | undefined {
  return useMemo(() => {
    if (!ve)
      return undefined

    const currentExpiry = ve.currentPositionExpiry
      ? JSBI.toNumber(ve.currentPositionExpiry)
      : (
          Number.parseInt(
            (getUnixTime(addWeeks(startOfWeek(Date.now(), { weekStartsOn: 4 }), 1)) / 86400).toString(),
          ) + 1
        ) * 86400

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
