import type { NextApiRequest, NextApiResponse } from 'next'
import stringify from 'fast-json-stable-stringify'
import { getMarkets } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  const pools = await getMarkets()
  res.status(200).send(stringify(pools))
}
