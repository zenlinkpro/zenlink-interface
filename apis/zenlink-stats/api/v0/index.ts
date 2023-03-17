import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUnixTime } from 'date-fns'

import { SUPPORTED_CHAINS } from '../../config'
import redis from '../../lib/redis'

export default async (_request: VercelRequest, response: VercelResponse) => {
  const allStats = await Promise.all(
    SUPPORTED_CHAINS.map(chainId => redis.hget('zlk-stats', chainId.toString())),
  )

  const data = allStats
    .filter((stats): stats is string => !!stats)
    .map((stats) => {
      const json = JSON.parse(stats)
      const now = getUnixTime(Date.now())
      return {
        ...json,
        updatedSecondsAgo: now - json.updatedAtTimestamp,
      }
    })

  return response.status(200).json({ data })
}
