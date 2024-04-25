import type { JSBI } from '@zenlink-interface/math'
import { getUnixTime } from 'date-fns'

export function isExpired(expiry: number, currentTime: number): boolean {
  return expiry <= currentTime
}

export function isCurrentExpired(expiry: JSBI): boolean {
  return isExpired(Number.parseInt(expiry.toString()), getUnixTime(Date.now()))
}
