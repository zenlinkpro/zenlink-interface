import type { JSBI } from '@zenlink-interface/math'
import { format, getUnixTime } from 'date-fns'
import type { Market } from '../Market'

export function isExpired(expiry: number, currentTime: number): boolean {
  return expiry <= currentTime
}

export function isCurrentExpired(expiry: JSBI): boolean {
  return isExpired(Number.parseInt(expiry.toString()), getUnixTime(Date.now()))
}

export function getMaturityFormatDate(market: Market): string {
  return format(Number(market.expiry.toString()) * 1000, 'dd MMM yyyy')
}
