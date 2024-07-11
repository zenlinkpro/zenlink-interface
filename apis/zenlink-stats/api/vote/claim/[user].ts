import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { ClaimData } from '../../../types'
import userResults from './user-results.json'

export default async (request: VercelRequest, response: VercelResponse) => {
  const user = request.query.user as string

  const userData = (userResults as Record<string, ClaimData[]>)[user]
  if (!userData)
    return response.status(204)

  return response.status(200).json({
    data: userData,
  })
}
