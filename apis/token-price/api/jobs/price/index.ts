import type { VercelRequest, VercelResponse } from '@vercel/node'

import { execute } from './util'

export default async (_: VercelRequest, response: VercelResponse) => {
  await execute()
  return response.status(200).json({
    success: 'Update Success',
  })
}
