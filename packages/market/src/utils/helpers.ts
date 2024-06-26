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

export function toWei(num: number): number {
  return Math.floor(10 ** 9 * num) * (10 ** 9)
}

/**
 * Validates the given start and end timestamps.
 * @param {number} startTimestamp - The Unix timestamp (in seconds) for the start time.
 * @param {number} endTimestamp - The Unix timestamp (in seconds) for the end time.
 * @throws {Error} Will throw an error if the start timestamp is after or equal to the end timestamp, or if the end timestamp does not correspond to a Thursday at 12 AM UTC.
 */
function validateTimestamps(startTimestamp: number, endTimestamp: number) {
  if (startTimestamp >= endTimestamp)
    throw new Error('Start timestamp must be before end timestamp')
  const endDate = new Date(endTimestamp * 1000) // convert Unix timestamp to JavaScript Date
  const isValidEndDate
      = endDate.getUTCDay() === 4
      && endDate.getUTCHours() === 0
      && endDate.getUTCMinutes() === 0
      && endDate.getUTCSeconds() === 0
  if (!isValidEndDate)
    throw new Error('Maturity must be at Thursday 12 AM')
}

/**
 * Calculates the parameters scalarRoot and rateAnchor.
 * @param {number} rateMin - The minimum rate (e.g. 1% APY = 0.01).
 * @param {number} rateMax - The maximum rate (e.g. 5% APY = 0.05).
 * @param {number} startTimestamp - The Unix timestamp (in seconds) for the start time.
 * @param {number} endTimestamp - The Unix timestamp (in seconds) for the end time.
 * @return {object} An object containing the scalarRoot and rateAnchor values.
 * @throws {Error} Will throw an error if the start timestamp is after or equal to the end timestamp, or if the end timestamp does not correspond to a Thursday at 12 AM UTC.
 */
export function calculateParameters(
  rateMin: number,
  rateMax: number,
  startTimestamp: number,
  endTimestamp: number,
): { scalarRoot: number, initialRateAnchor: number } {
  validateTimestamps(startTimestamp, endTimestamp)
  const yearsToExpiry = (endTimestamp - startTimestamp) / 31536000
  const rateMinScaled = (rateMin + 1) ** yearsToExpiry
  const rateMaxScaled = (rateMax + 1) ** yearsToExpiry
  const initialRateAnchor = (rateMinScaled + rateMaxScaled) / 2
  const rateDiff = Math.max(Math.abs(rateMaxScaled - initialRateAnchor), Math.abs(initialRateAnchor - rateMinScaled))
  const scalarRoot = (Math.log(9) * yearsToExpiry) / rateDiff
  return { scalarRoot: toWei(scalarRoot), initialRateAnchor: toWei(initialRateAnchor) }
}

/**
 *
 * @param fee the fee in percentage (eg 0.5% = 0.5)
 * @returns the natural logaritm of 1 + fee in 18 decimal places
 */
export function calcFee(fee: number): number {
  const feeFloat = Math.log(1 + fee / 100)
  return Math.floor(feeFloat * 10 ** 12) * (10 ** 6)
}
