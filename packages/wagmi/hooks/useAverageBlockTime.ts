import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useEffect, useState } from 'react'
import { useProvider } from 'wagmi'

export const useAverageBlockTime = (chainId: ParachainId) => {
  const [averageBlockTime, setAverageBlockTime] = useState(0)

  const provider = useProvider({
    chainId: chainsParachainIdToChainId[chainId],
  })
  useEffect(() => {
    if (!provider)
      return
    provider.getBlockNumber().then((_currentBlock) => {
      const currentBlock = _currentBlock - 100
      const blocks = currentBlock - 5000 < 1 ? currentBlock - 1 : 5000
      return Promise.all([
        provider.getBlock(currentBlock),
        provider.getBlock(currentBlock - blocks),
      ])
    }).then(([currentBlockInfo, anchorBlockInfo]) => {
      const averageBlock = (currentBlockInfo.timestamp - anchorBlockInfo.timestamp) / (currentBlockInfo.number - anchorBlockInfo.number)
      setAverageBlockTime(Number((averageBlock * 1000).toFixed(0)))
    })
  }, [chainId, provider])

  return averageBlockTime
}
