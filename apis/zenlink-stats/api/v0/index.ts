import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async (_: VercelRequest, response: VercelResponse) => {
  return response.status(200).json({ message: 'hello' })
}
