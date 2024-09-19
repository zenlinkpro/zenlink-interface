import type { ParachainId } from '@zenlink-interface/chain'
import type {
  TokenPricesQuery,
  TokenPricesQueryVariables,
} from '../__generated__/types-and-hooks'
import { gql } from '@apollo/client'
import { wrapResultData } from '.'
import { LEGACY_CLIENTS } from '../appolo'

const TOKEN_PRICES_FETCH = gql`
  query tokenPrices($where: TokenWhereInput, $limit: Int) {
    tokens(where: $where, limit: $limit) {
      id
      derivedETH
      totalLiquidity
    }
    bundleById(id: "1") {
      ethPrice
    }
  }
`

const defaultTokenPricesFetcherParams: TokenPricesQueryVariables = {
  where: { derivedETH_gt: '0.000000' },
  limit: 1000,
}

export async function fetchTokenPrices(
  chainId: ParachainId,
) {
  let data: TokenPricesQuery | null = null
  let error = false

  try {
    const { data: tokenPricesData } = await LEGACY_CLIENTS[chainId].query<TokenPricesQuery>({
      query: TOKEN_PRICES_FETCH,
      variables: defaultTokenPricesFetcherParams,
    })
    data = tokenPricesData ?? null
  }
  catch {
    error = true
  }

  return wrapResultData(data, error)
}
