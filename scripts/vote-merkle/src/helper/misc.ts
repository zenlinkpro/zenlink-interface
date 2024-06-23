import type { RC } from './types'

export function getWeekStartTimestamp(timestamp: number): number {
  const week = Math.floor(timestamp / 604800)
  return week * 604800
}

export function getWeekEndTimestamp(timestamp: number): number {
  return getWeekStartTimestamp(timestamp) + 604800
}

export function normalizeRawRC(rawUserRewards: Record<string, string>): RC {
  const userRewards: RC = {}
  for (const user of Object.keys(rawUserRewards)) {
    const reward = BigInt(rawUserRewards[user])
    userRewards[user] = reward
  }
  return userRewards
}
