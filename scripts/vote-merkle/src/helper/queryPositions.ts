import type { PoolsData } from './types'
import { ParachainId } from '@zenlink-interface/chain'
import { fetchVotePositions } from '@zenlink-interface/graph-client'
import { getWeekStartTimestamp } from './misc'
import { UserVeBalanceList } from './types'

export async function queryVotePositions(timestampTo: number) {
  const datas = await fetchVotePositions(ParachainId.MOONBEAM, timestampTo)
  if (!datas.data)
    return {}

  const poolsData: PoolsData = {}
  for (const data of datas.data) {
    if (!poolsData[data.pool])
      poolsData[data.pool] = {}
    if (!poolsData[data.pool][data.user])
      poolsData[data.pool][data.user] = new UserVeBalanceList()
    poolsData[data.pool][data.user].addSnapshot(data.slope, data.bias, getWeekStartTimestamp(data.timestamp))
  }

  return poolsData
}
