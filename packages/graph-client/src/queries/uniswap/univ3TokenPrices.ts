import { gql } from '@apollo/client'
import type { ParachainId } from '@zenlink-interface/chain'
import type { UniV3TokenPricesQuery, UniV3TokenPricesQueryVariables } from '../../__generated__/uniswap-v3-types'
import { LEGACY_CLIENTS } from '../../appolo'
import { wrapResultData } from '..'

const UNIV3_TOKEN_PRICES_FETCH = gql`
  query uniV3TokenPrices($where: Token_filter, $first: Int) {
    tokens(where: $where, first: $first) {
      id
      derivedETH
      totalSupply
    }
    bundle(id: "1") {
      ethPriceUSD
    }
  }
`

const defaultTokenPricesFetcherParams: UniV3TokenPricesQueryVariables = {
  where: { derivedETH_gt: '0', totalValueLockedUSD_gt: '1000' },
  first: 1000,
}

export async function fetchUniV3TokenPrices(chainId: ParachainId) {
  let data: UniV3TokenPricesQuery | null = null
  let error = false

  try {
    const { data: tokenPricesData } = await LEGACY_CLIENTS[chainId].query<UniV3TokenPricesQuery>({
      query: UNIV3_TOKEN_PRICES_FETCH,
      variables: defaultTokenPricesFetcherParams,
    })

    data = tokenPricesData ?? null
  }
  catch {
    error = true
  }

  return wrapResultData(data, error)
}
