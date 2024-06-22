import { fetchVotePositions } from '@zenlink-interface/graph-client'
import { ParachainId } from '@zenlink-interface/chain'
import { getWeekEndTimestamp } from './misc'
import type { PoolsData } from './types'
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
    poolsData[data.pool][data.user].addSnapshot(data.slope, data.bias, getWeekEndTimestamp(data.timestamp))
  }

  return poolsData
}
