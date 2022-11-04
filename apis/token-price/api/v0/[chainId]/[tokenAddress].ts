import type { VercelRequest, VercelResponse } from '@vercel/node'

import { SUPPORTED_CHAINS } from '../../../config'
import redis from '../../../lib/redis'

export default async (request: VercelRequest, response: VercelResponse) => {
  const chainId = request.query.chainId as string
  const tokenAddress = request.query.tokenAddress as string

  if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
    response
      .status(400)
      .json({ message: 'Unsupported network. Supported chain ids: '.concat(SUPPORTED_CHAINS.join(', ')) })
  }

  const data = await redis.hget('prices', chainId)

  if (!data)
    return response.status(204)

  const json = JSON.parse(data)
  const result = json[tokenAddress]

  if (!result) {
    response
      .status(400)
      .json({ message: `Cannot find token with address ${tokenAddress}` })
  }

  // price for [chainId] & [tokenAddress]
  return response.status(200).send(`price for ${chainId} & ${tokenAddress} is ${result}`)
}
