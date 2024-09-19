import type { TxStatusQuery } from '../__generated__/types-and-hooks'
import type { TxStatusQueryData } from '../types'
import { gql } from '@apollo/client'
import { wrapResultData } from '.'
import { ARCHIVE_CLIENTS } from '../appolo'

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
  let data: TxStatusQueryData | null = null
  let error = false

  try {
    const { data: txStatusData } = await ARCHIVE_CLIENTS[chainId].query<TxStatusQuery>({
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

  return wrapResultData(data, error)
}
