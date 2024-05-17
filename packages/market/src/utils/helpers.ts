import { JSBI } from '@zenlink-interface/math'
import { addWeeks, format, getUnixTime, startOfWeek } from 'date-fns'
import type { Market } from '../Market'

export function isExpired(expiry: number, currentTime: number): boolean {
  return expiry <= currentTime
}

export function isCurrentExpired(expiry: JSBI): boolean {
  return isExpired(JSBI.toNumber(expiry), getUnixTime(Date.now()))
}

export function getMaturityFormatDate(market: Market): string {
  return format(JSBI.toNumber(market.expiry) * 1000, 'dd MMM yyyy')
}

export function getWeekStartUnixTime(time?: number): number {
  return (
    Number.parseInt(
      (getUnixTime(addWeeks(startOfWeek(time || Date.now(), { weekStartsOn: 4 }), 1)) / 86400).toString(),
    ) + 1
  ) * 86400
}
