import { useEffect, useState } from 'react'
import { useApi } from './useApi'

export function useAverageBlockTime(chainId?: number, enabled = true) {
  const [averageBlockTime, setAverageBlockTime] = useState(0)
  const api = useApi(chainId)

  useEffect(() => {
    if (!api)
      return

    api.derive.chain.bestNumber()
      .then(async (_currentBlock) => {
        const currentBlock = _currentBlock.toNumber() - 100
        if (currentBlock <= 1) {
          setAverageBlockTime(12000)
          return
        }
        const blocks = currentBlock - 5000 < 1 ? currentBlock - 1 : 5000
        const [currentBlockHash, anchorBlockHash] = await Promise.all([
          api.rpc.chain.getBlockHash(currentBlock),
          api.rpc.chain.getBlockHash(currentBlock - blocks),
        ])
        const [currentBlockNumber, anchorBlockNumber] = await Promise.all([
          (await api.at(currentBlockHash)).query.timestamp.now(),
          (await api.at(anchorBlockHash)).query.timestamp.now(),
        ])
        const averageBlock = (Number(currentBlockNumber.toNumber()) - Number(anchorBlockNumber.toNumber())) / blocks
        setAverageBlockTime(Number((averageBlock).toFixed(0)))
      })
  }, [api, chainId])

  return averageBlockTime
}
