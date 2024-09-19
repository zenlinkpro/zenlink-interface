import type { ParachainId } from '@zenlink-interface/chain'
import type { TokensQuery } from '../__generated__/types-and-hooks'
import type { TokenQueryData } from '../types'
import { gql } from '@apollo/client'
import { wrapResultData } from '.'
import { LEGACY_CLIENTS } from '../appolo'

const TOKENS_BY_IDS = gql`
  query tokens($ids: [String!], $limit: Int) {
    tokens(where: { id_in: $ids }, limit: $limit) {
      id
      symbol
      name
      decimals
    }
  }
`

export async function fetchTokensByIds(chainId: ParachainId, ids: Set<string>) {
  let data: TokenQueryData[] | null = null
  let error = false

  try {
    const { data: tokensData } = await LEGACY_CLIENTS[chainId].query<TokensQuery>({
      query: TOKENS_BY_IDS,
      variables: {
        ids: Array.from(ids.values()),
        limit: 1000,
      },
    })
    data = tokensData.tokens
  }
  catch {
    error = true
  }

  return wrapResultData(data, error)
}
