import redis from './redis'

export async function execute() {
  await redis.hset(
    'prices',
    { 123: 456 },
  )
  // eslint-disable-next-line no-console
  console.log('Finished updating prices')
  process.exit()
}
