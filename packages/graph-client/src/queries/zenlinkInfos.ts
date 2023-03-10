import { gql } from '@apollo/client'
import type { ParachainId } from '@zenlink-interface/chain'
import { CLIENTS } from '../appolo'
import type { ZenlinkStatData } from '../types'
import type { TokensQuery, ZenlinkInfo } from '../__generated__/types-and-hooks'
import { wrapResultData } from '.'

const ZENLINK_STATS = gql`
  {
    zenlinkInfoById(id: "1") {
      totalTvlUSD
      totalVolumeUSD
    }
  }
`

export async function fetchZenlinkStats(chainId: ParachainId) {
  let data: ZenlinkStatData | undefined
  let error = false

  try {
    const { data: result } = await CLIENTS[chainId].query<ZenlinkStatData>({
      query: ZENLINK_STATS,
    })
    data = result
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
    error = true
  }

  return wrapResultData(data, error)
}

const ZLK_BURN = gql`
  {
    zlkInfoById(id: "1") {
      id
      burn
    }
  }
`
export async function fetchZLKBurn(chainId: ParachainId) {
  let data: ZenlinkStatData | undefined
  let error = false

  try {
    const { data: result } = await CLIENTS[chainId].query<ZenlinkStatData>({
      query: ZLK_BURN,
    })
    data = result
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
    error = true
  }

  return wrapResultData(data, error)
}
