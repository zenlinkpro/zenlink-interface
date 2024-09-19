import type { NextApiRequest, NextApiResponse } from 'next'
import type { GetUserQuery } from '../../../lib/api'
import stringify from 'fast-json-stable-stringify'
import { getUser } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  if (!req.query?.id)
    res.status(422)
  const user = await getUser(req.query as unknown as GetUserQuery)
  res.status(200).send(stringify(user))
}
