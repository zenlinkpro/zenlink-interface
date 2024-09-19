import type { ParachainId } from '@zenlink-interface/chain'
import type { DaySnapshotsQuery, DaySnapshotsQueryVariables } from '../__generated__/types-and-hooks'
import type { DaySnapshotsQueryData } from '../types'
import { gql } from '@apollo/client'
import { wrapResultData } from '.'
import { ZenlinkDayInfoOrderByInput } from '../__generated__/types-and-hooks'
import { LEGACY_CLIENTS } from '../appolo'

const DAY_SNAPSHOTS = gql`
  query daySnapshots(
    $limit: Int,
    $orderBy: [ZenlinkDayInfoOrderByInput!],
  ) {
    zenlinkDayInfos(orderBy: $orderBy, limit: $limit) {
      dailyVolumeUSD
      tvlUSD
      date
    }
  }
`

interface DaySnapshotsFetcherParams {
  chainId: ParachainId
  limit: number
  orderBy: ZenlinkDayInfoOrderByInput
}

const defaultDaySnapshotsFetcherParams: DaySnapshotsQueryVariables = {
  limit: 1000,
  orderBy: [ZenlinkDayInfoOrderByInput.DateDesc],
}

export async function fetchDaySnapshots({ chainId, limit, orderBy }: DaySnapshotsFetcherParams) {
  let data: DaySnapshotsQueryData[] | null = null
  let error = false

  try {
    const { data: daySnapshots } = await LEGACY_CLIENTS[chainId].query<DaySnapshotsQuery>({
      query: DAY_SNAPSHOTS,
      variables: {
        ...defaultDaySnapshotsFetcherParams,
        limit,
        orderBy,
      },
    })
    data = daySnapshots.zenlinkDayInfos
  }
  catch {
    error = true
  }

  return wrapResultData(data, error)
}
