import type { NextApiRequest, NextApiResponse } from 'next'
import type { GetPoolsQuery } from '../../../lib/api'

import stringify from 'fast-json-stable-stringify'
import { getStablePools } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  const query = req.query as unknown
  const pools = await getStablePools(query as GetPoolsQuery)
  res.status(200).send(stringify(pools))
}
