import type { ApiPromise } from '@polkadot/api'
import type { SubmittableExtrinsic } from '@polkadot/api/types'
import type { Weight } from '@polkadot/types/interfaces'
import { isFunction, nextTick } from '@polkadot/util'
import { useEffect, useMemo, useState } from 'react'

import { useAccounts } from './useAccounts'
import { useApi } from './useApi'
import { convertWeight } from './useWeight'

export type BatchType = 'all' | 'default'

export interface BatchOptions {
  max?: number
  type?: BatchType
}

function createBatches(
  api: ApiPromise,
  txs: SubmittableExtrinsic<'promise'>[],
  batchSize: number,
  type: BatchType = 'default',
): SubmittableExtrinsic<'promise'>[] {
  if (batchSize === 1 || !isFunction(api.tx.utility?.batch))
    return txs

  return txs
    .reduce((batches: SubmittableExtrinsic<'promise'>[][], tx): SubmittableExtrinsic<'promise'>[][] => {
      const batch = batches[batches.length - 1]

      if (batch.length >= batchSize)
        batches.push([tx])

      else
        batch.push(tx)

      return batches
    }, [[]])
    .map((batch): SubmittableExtrinsic<'promise'> =>
      batch.length === 1
        ? batch[0]
        : type === 'all' && isFunction(api.tx.utility.batchAll)
          ? api.tx.utility.batchAll(batch)
          : api.tx.utility.batch(batch),
    )
}

export function useTxBatch(
  chainId?: number,
  txs?: SubmittableExtrinsic<'promise'>[] | null | false,
  options?: BatchOptions,
): SubmittableExtrinsic<'promise'>[] | null {
  const api = useApi(chainId)
  const { allAccounts } = useAccounts()
  const [batchSize, setBatchSize] = useState(() => Math.floor(options?.max || 64))

  useEffect((): void => {
    api && txs && txs.length && allAccounts[0] && txs[0].hasPaymentInfo
    && nextTick(async (): Promise<void> => {
      try {
        const paymentInfo = await txs[0].paymentInfo(allAccounts[0].address)
        const weight = convertWeight(paymentInfo.weight)
        const maxBlock = convertWeight(
          api.consts.system.blockWeights
            ? api.consts.system.blockWeights.maxBlock
            : api.consts.system.maximumBlockWeight as Weight,
        )

        setBatchSize(prev =>
          weight.v1Weight.isZero()
            ? prev
            : Math.floor(
              maxBlock.v1Weight
                .muln(64) // 65% of the block weight on a single extrinsic (64 for safety)
                .div(weight.v1Weight)
                .toNumber() / 100,
            ),
        )
      }
      catch (error) {
        console.error(error)
      }
    })
  }, [allAccounts, api, options, txs])

  return useMemo(
    () => api && txs && txs.length
      ? createBatches(api, txs, batchSize, options?.type)
      : null,
    [api, batchSize, options, txs],
  )
}
