import { gql } from '@apollo/client'
import type { ParachainId } from '@zenlink-interface/chain'
import type {
  MarketByIdQuery,
  MarketByIdQueryVariables,
  MarketOrderByInput,
  MarketsQuery,
  MarketsQueryVariables,
} from '../../__generated__/market-types'
import { MarketDayDataOrderByInput, MarketHourDataOrderByInput } from '../../__generated__/market-types'
import { MARKET_CLIENTS } from '../../appolo'
import { wrapResultData } from '..'
import type { MarketQueryData } from '../../types'

const MARKET_BY_ID = gql`
  query marketById(
    $id: String!, 
    $hourDataOrderBy: [MarketHourDataOrderByInput!],
    $hourDataLimit: Int,
    $dayDataOrderBy: [MarketDayDataOrderByInput!],
    $dayDataLimit: Int
  ) {
    marketById(id: $id) {
      id
      reserveUSD
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
      marketHourData(orderBy: $hourDataOrderBy, limit: $hourDataLimit) {
        id
        hourStartUnix
        reserveUSD
        hourlyVolumeUSD
      }
      marketDayData(orderBy: $dayDataOrderBy, limit: $dayDataLimit) {
        id
        date
        reserveUSD
        dailyVolumeUSD
        dailyFeeUSD
        underlyingAPY
        impliedAPY
        fixedROI
        longYieldROI
      }
    }
  }
`

const defaultMarketFetcherParams: Omit<MarketByIdQueryVariables, 'id'> = {
  hourDataOrderBy: MarketHourDataOrderByInput.HourStartUnixDesc,
  hourDataLimit: 168,
  dayDataOrderBy: MarketDayDataOrderByInput.DateDesc,
  dayDataLimit: 750,
}

export async function fetchMarketById(chainId: ParachainId, id: string) {
  let data: MarketQueryData | null = null
  let error = false

  try {
    const { data: market } = await MARKET_CLIENTS[chainId].query<MarketByIdQuery>({
      query: MARKET_BY_ID,
      variables: {
        ...defaultMarketFetcherParams,
        id,
      },
    })
    data = market.marketById ?? null
  }
  catch {
    error = true
  }

  return wrapResultData(data, error)
}

const MARKETS = gql`
  query markets(
    $limit: Int, 
    $orderBy: [MarketOrderByInput!],
    $hourDataOrderBy: [MarketHourDataOrderByInput!],
    $hourDataLimit: Int,
    $dayDataOrderBy: [MarketDayDataOrderByInput!],
    $dayDataLimit: Int
  ) {
    markets(limit: $limit, orderBy: $orderBy) {
      id
      reserveUSD
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
      marketHourData(orderBy: $hourDataOrderBy, limit: $hourDataLimit) {
        id
        hourStartUnix
        reserveUSD
        hourlyVolumeUSD
      }
      marketDayData(orderBy: $dayDataOrderBy, limit: $dayDataLimit) {
        id
        date
        reserveUSD
        dailyVolumeUSD
        dailyFeeUSD
        underlyingAPY
        impliedAPY
        fixedROI
        longYieldROI
      }
    }
  }
`

interface MarketsFetcherParams {
  chainId: ParachainId
  limit: number
  orderBy: MarketOrderByInput
}

const defaultMarketsFetcherParams: Omit<MarketsQueryVariables, 'limit' | 'orderBy'> = {
  hourDataOrderBy: MarketHourDataOrderByInput.HourStartUnixDesc,
  hourDataLimit: 24,
  dayDataOrderBy: MarketDayDataOrderByInput.DateDesc,
  dayDataLimit: 7,
}

export async function fetchMarkets({
  chainId,
  limit,
  orderBy,
}: MarketsFetcherParams) {
  let data: MarketQueryData[] | null = null
  let error = false

  try {
    const { data: markets } = await MARKET_CLIENTS[chainId].query<MarketsQuery>({
      query: MARKETS,
      variables: {
        ...defaultMarketsFetcherParams,
        limit,
        orderBy,
      },
    })
    data = markets.markets
  }
  catch (err) {
    error = true
  }

  return wrapResultData(data, error)
}
