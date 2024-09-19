import type { ParachainId } from '@zenlink-interface/chain'
import type { ZenlinkStatsQuery, ZenlinkTokenInfoQuery, ZlkInfo } from '../__generated__/types-and-hooks'
import type { ZenlinkInfo } from '../types'
import { gql } from '@apollo/client'
import { wrapResultData } from '.'
import { LEGACY_CLIENTS } from '../appolo'

const ZENLINK_STATS = gql`
  query zenlinkStats($id: String!) {
    zenlinkInfoById(id: $id) {
      totalTvlUSD
      totalVolumeUSD
    }
  }
`

export async function fetchZenlinkStats(chainId: ParachainId) {
  let data: ZenlinkInfo | undefined
  let error = false

  try {
    const { data: zenlinkStats } = await LEGACY_CLIENTS[chainId].query<ZenlinkStatsQuery>({
      query: ZENLINK_STATS,
      variables: { id: '1' },
    })
    data = zenlinkStats.zenlinkInfoById
  }
  catch (e) {
    error = true
  }

  return wrapResultData(data, error)
}

const ZLK_TOKEN_INFO = gql`
  query zenlinkTokenInfo($id: String!) {
    zlkInfoById(id: $id) {
      id
      burn
      updatedDate
    }
  }
`
export async function fetchZLKTokenInfo(chainId: ParachainId) {
  let data: ZlkInfo | undefined
  let error = false

  try {
    const { data: result } = await LEGACY_CLIENTS[chainId].query<ZenlinkTokenInfoQuery>({
      query: ZLK_TOKEN_INFO,
      variables: { id: '1' },
    })
    data = result.zlkInfoById
  }
  catch (e) {
    error = true
  }

  return wrapResultData(data, error)
}
