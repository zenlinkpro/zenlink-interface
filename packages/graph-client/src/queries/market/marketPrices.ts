import { gql } from '@apollo/client'
import type { ParachainId } from '@zenlink-interface/chain'
import type { MarketPricesQuery, MarketPricesQueryVariables } from '../../__generated__/market-types'
import { MARKET_CLIENTS } from '../../appolo'
import { wrapResultData } from '..'

const MARKET_PRICES_FETCH = gql`
  query marketPrices($where: MarketWhereInput, $limit: Int) {
    markets(where: $where, limit: $limit) {
      id
      priceUSD
      sy {
        id
        priceUSD
        baseAsset {
          id
          priceUSD
        }
        yieldToken {
          id
          priceUSD
        }
      }
      pt {
        id
        priceUSD
      }
      yt {
        id
        priceUSD
      }
    }
  }
`

const defaultTokenPricesFetcherParams: MarketPricesQueryVariables = {
  where: { priceUSD_gt: 0 },
  limit: 1000,
}

export async function fetchMarketPrices(chainId: ParachainId) {
  let data: MarketPricesQuery | null = null
  let error = false

  try {
    const { data: tokenPricesData } = await MARKET_CLIENTS[chainId].query<MarketPricesQuery>({
      query: MARKET_PRICES_FETCH,
      variables: defaultTokenPricesFetcherParams,
    })
    data = tokenPricesData ?? null
  }
  catch {
    error = true
  }

  return wrapResultData(data, error)
}
