import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUnixTime } from 'date-fns'

import { SUPPORTED_CHAINS } from '../../config'
import redis from '../../lib/redis'

export default async (request: VercelRequest, response: VercelResponse) => {
  const chainId = request.query.chainId as string

  if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
    response
      .status(400)
      .json({ message: 'Unsupported network. Supported chain ids: '.concat(SUPPORTED_CHAINS.join(', ')) })
  }
  const data = await redis.hget('zlk-stats', chainId)

  if (!data)
    return response.status(204)

  const json = JSON.parse(data)

  const now = getUnixTime(Date.now())

  return response.status(200).json({
    ...json,
    updatedSecondsAgo: now - json.updatedAtTimestamp,
  })
}
