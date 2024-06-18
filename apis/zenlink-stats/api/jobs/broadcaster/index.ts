import type { VercelRequest, VercelResponse } from '@vercel/node'
import { broadcast } from './moonbeam'

export default async (_: VercelRequest, response: VercelResponse) => {
  await broadcast()
  return response.status(200).json({
    success: 'Vote results broadcasted!',
  })
}
