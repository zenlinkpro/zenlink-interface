import * as dotenv from 'dotenv'
import Redis from 'ioredis'

dotenv.config()

if (!process.env.REDIS_URL)
  throw new Error('REDIS_URL is required')

const redis = new Redis(process.env.REDIS_URL, {
  tls: {
    rejectUnauthorized: false,
  },
})

export default redis
