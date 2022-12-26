import { gql } from '@apollo/client'
import type { ParachainId } from '@zenlink-interface/chain'
import { CLIENTS } from '../appolo'
import type { TokenMeta } from '../types'

const TOKENS_BY_IDS = gql`
  query pairs($ids: [String!]) {
    tokens(where: { id_in: $ids }, limit: 1000) {
      id
      symbol
      name
      decimals
    }
  }
`

export async function fetchTokensByIds(chainId: ParachainId, ids: Set<string>) {
  let data: TokenMeta[] | null = null
  let error = false

  try {
    const { data: tokensData } = await CLIENTS[chainId].query({
      query: TOKENS_BY_IDS,
      variables: {
        ids: Array.from(ids.values()),
      },
    })
    data = tokensData.tokens
  }
  catch {
    error = true
  }

  if (data) {
    return {
      data,
      error: false,
    }
  }
  else {
    return {
      data: undefined,
      error,
    }
  }
}
