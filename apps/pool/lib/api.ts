import { liquidityPositions, pairById, pairsByChainIds } from '@zenlink-interface/graph-client'
import { SUPPORTED_CHAIN_IDS } from 'config'
import stringify from 'fast-json-stable-stringify'

export interface GetUserQuery {
  id: string
  networks: string
}

export const getUser = async (query: GetUserQuery) => {
  const networks = JSON.parse(query?.networks || stringify(SUPPORTED_CHAIN_IDS))
  const positions = await liquidityPositions(networks, query.id.toLowerCase())
  return positions
}

export interface GetPoolsQuery {
  networks: string
  limit?: number
  orderBy?: string
}

export const getPools = async (query?: GetPoolsQuery) => {
  const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS
  const pairs = await pairsByChainIds({ chainIds })
  return pairs
}

export const getPool = async (id: string) => {
  if (!id.includes(':'))
    throw new Error('Invalid pair id')
  const pair = await pairById(id)
  return pair
}
