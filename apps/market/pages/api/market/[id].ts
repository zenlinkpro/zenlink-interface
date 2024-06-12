import type { NextApiRequest, NextApiResponse } from 'next'

import { getMarket } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const market = await getMarket(req.query.id as string)
  res.status(200).send(market)
}
