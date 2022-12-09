import { gql } from '@apollo/client'
import { ARCHIVE_CLIENTS } from '../appolo'
import type { TxStatusMeta } from '../types'

const TX_STATUS_QUERY = gql`
  query txStatus($hash: String) {
    extrinsics(limit: 1, where: { hash_eq: $hash }) {
      id
      hash
      success
      block {
        height
        timestamp
      }
    }
  }
`

export async function fetchTxStatus(chainId: number, hash: string) {
  let data: TxStatusMeta | null = null
  let error = false

  try {
    const { data: txStatusData } = await ARCHIVE_CLIENTS[chainId].query({
      query: TX_STATUS_QUERY,
      variables: {
        hash,
      },
    })
    data = txStatusData.extrinsics[0]
  }
  catch {
    error = true
  }

  if (data) {
    return {
      data,
      error: false,
    }
  }
  else {
    return {
      data: undefined,
      error,
    }
  }
}
