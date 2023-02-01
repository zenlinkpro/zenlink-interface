import cors from '@fastify/cors'
import fastify from 'fastify'

const server = fastify({ logger: true })
server.register(cors)
