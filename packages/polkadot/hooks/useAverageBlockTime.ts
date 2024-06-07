import { useEffect, useState } from 'react'

import { statics } from '../utils'
import { useApi } from './useApi'

const BlockNumber = statics.registry.createType('u64')

export function useAverageBlockTime(chainId?: number, enabled = true) {
  const [averageBlockTime, setAverageBlockTime] = useState(0)
  const api = useApi(chainId)

  useEffect(() => {
    if (!api || !enabled)
      return

    api.derive.chain.bestNumber()
      .then(async (_currentBlock) => {
        const currentBlock = _currentBlock.toNumber() - 100
        const blocks = currentBlock - 5000 < 1 ? currentBlock - 1 : 5000
        const [currentBlockHash, anchorBlockHash] = await Promise.all([
          api.rpc.chain.getBlockHash(currentBlock),
          api.rpc.chain.getBlockHash(currentBlock - blocks),
        ])
        const [currentBlockNumber, anchorBlockNumber] = await Promise.all([
          (await api.at(currentBlockHash)).query.timestamp.now() as Promise<typeof BlockNumber>,
          (await api.at(anchorBlockHash)).query.timestamp.now() as Promise<typeof BlockNumber>,
        ])
        const averageBlock = (Number(currentBlockNumber.toNumber()) - Number(anchorBlockNumber.toNumber())) / blocks
        setAverageBlockTime(Number((averageBlock).toFixed(0)))
      })
  }, [api, chainId, enabled])

  return averageBlockTime
}
