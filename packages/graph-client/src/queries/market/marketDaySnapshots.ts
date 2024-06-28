import { gql } from '@apollo/client'
import type { ParachainId } from '@zenlink-interface/chain'
import type { MarketDaySnapshotsQuery, MarketDaySnapshotsQueryVariables } from '../../__generated__/market-types'
import { FactoryDayDataOrderByInput } from '../../__generated__/market-types'
import type { MarketDaySnapshotsQueryData } from '../../types'
import { wrapResultData } from '..'
import { MARKET_CLIENTS } from '../../appolo'

const MARKET_DAY_SNAPSHOTS = gql`
  query marketDaySnapshots(
    $limit: Int,
    $orderBy: [FactoryDayDataOrderByInput!],
  ) {
    factoryDayData(orderBy: $orderBy, limit: $limit) {
      dailyVolumeUSD
      totalLiquidityUSD
      date
    }
  }
`

interface DaySnapshotsFetcherParams {
  chainId: ParachainId
  limit: number
  orderBy: FactoryDayDataOrderByInput
}

const defaultDaySnapshotsFetcherParams: MarketDaySnapshotsQueryVariables = {
  limit: 1000,
  orderBy: [FactoryDayDataOrderByInput.DateDesc],
}

export async function fetchMarketDaySnapshots({ chainId, limit, orderBy }: DaySnapshotsFetcherParams) {
  let data: MarketDaySnapshotsQueryData[] | null = null
  let error = false

  try {
    const { data: daySnapshots } = await MARKET_CLIENTS[chainId].query<MarketDaySnapshotsQuery>({
      query: MARKET_DAY_SNAPSHOTS,
      variables: {
        ...defaultDaySnapshotsFetcherParams,
        limit,
        orderBy,
      },
    })
    data = daySnapshots.factoryDayData
  }
  catch {
    error = true
  }

  return wrapResultData(data, error)
}
