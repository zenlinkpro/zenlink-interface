import { gql } from '@apollo/client'
import type { ParachainId } from '@zenlink-interface/chain'
import type { VotePositionData } from '../../types'
import { MARKET_CLIENTS } from '../../appolo'
import type { VotePositionQueryQuery } from '../../__generated__/market-types'
import { wrapResultData } from '..'

const votingPositionQuery = gql`
  query VotePositionQuery($timestampTo: BigInt!, $synchingIndexFrom: Int!) {
    votingEvents(
      limit: 1000
      where: { timestamp_lt: $timestampTo, syncingIndex_gte: $synchingIndexFrom }
      orderBy: syncingIndex_DESC
    ) {
      user
      bias
      slope
      timestamp
      pool
      syncingIndex
    }
  }
`

export async function fetchVotePositions(chainId: ParachainId, timestampTo: number) {
  const datas: VotePositionData[] = []
  let error = false

  try {
    for (let synchingIndexFrom = 0; ;) {
      const { data } = await MARKET_CLIENTS[chainId].query<VotePositionQueryQuery>({
        query: votingPositionQuery,
        variables: {
          timestampTo: timestampTo.toString(),
          synchingIndexFrom,
        },
      })

      for (const raw of data.votingEvents) {
        datas.push({
          pool: raw.pool,
          user: raw.user,
          bias: BigInt(raw.bias),
          slope: BigInt(raw.slope),
          timestamp: Number.parseInt(raw.timestamp),
        })
      }

      if (data.votingEvents.length < 1000)
        break
      synchingIndexFrom = data.votingEvents[999].syncingIndex
    }
  }
  catch {
    error = true
  }

  return wrapResultData(datas, error)
}
