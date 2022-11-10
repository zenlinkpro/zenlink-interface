import { liquidityPositions, pairById } from '@zenlink-interface/graph-client'
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

export const getPool = async (id: string) => {
  if (!id.includes(':'))
    throw new Error('Invalid pair id')
  const pair = await pairById(id)
  return pair
}
