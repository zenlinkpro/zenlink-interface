import cors from '@fastify/cors'
import fastify from 'fastify'

const server = fastify({ logger: true })
server.register(cors)

// let dataFetcher: DataFetcher

// const querySchema = z.object({
//   chainId: z.coerce
//     .number()
//     .int()
//     .gte(0)
//     .lte(2 ** 256)
//     .default(ParachainId.ASTAR),
//   fromTokenId: z.string().default('Native'),
//   toTokenId: z.string().default('ZLK'),
//   gasPrice: z.coerce.number().int().gte(1),
//   amount: z.coerce.string(),
//   to: z.optional(z.string()),
// })

server.get('/v0', async (request) => {
  // const {
  //   chainId,
  //   fromTokenId,
  //   toTokenId,
  //   amount,
  //   gasPrice,
  //   to,
  // } = querySchema.parse(request.query)
  return `hello${JSON.stringify(request.query)}`
})

// Run the server!
const start = async () => {
  try {
    await server.listen({ port: 3008 })
  }
  catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
