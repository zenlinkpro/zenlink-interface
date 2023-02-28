import { gql } from '@apollo/client'
import type { ParachainId } from '@zenlink-interface/chain'
import { ZenlinkDayInfoOrderByInput } from '../__generated__/types-and-hooks'
import type { DaySnapshotsQuery, DaySnapshotsQueryVariables } from '../__generated__/types-and-hooks'
import type { DaySnapshotsQueryData } from '../types'
import { CLIENTS } from '../appolo'
import { wrapResultData } from '.'

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
    const { data: daySnapshots } = await CLIENTS[chainId].query<DaySnapshotsQuery>({
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
