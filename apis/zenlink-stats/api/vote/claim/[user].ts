import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { ClaimDataWithContract } from '../../../types'
import { getAddress } from 'viem'
import userResults from './user-results.json'

export default async (request: VercelRequest, response: VercelResponse) => {
  const user = request.query.user as string

  const userData = (userResults as Record<string, ClaimDataWithContract[]>)[getAddress(user)]
  if (!userData) {
    return response.status(200).json({
      data: [],
    })
  }

  return response.status(200).json({
    data: userData,
  })
}
