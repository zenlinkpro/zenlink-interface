import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useEffect, useState } from 'react'
import { useProvider } from 'wagmi'
import { useBlockNumber } from './useBlockNumber'

const BLOCKS = 5000

export const useAverageBlockTime = (chainId: ParachainId) => {
  const [averageBlockTime, setAverageBlockTime] = useState(0)
  const blockNumber = useBlockNumber(chainId)
  const provider = useProvider({
    chainId: chainsParachainIdToChainId[chainId],
  })

  useEffect(() => {
    if (!provider || !blockNumber)
      return

    Promise.all([
      provider.getBlock(blockNumber),
      provider.getBlock(blockNumber - BLOCKS),
    ])
      .then(([blockInfo, prevBlockInfo]) => {
        const averageBlock
          = (blockInfo.timestamp - prevBlockInfo.timestamp) / (blockInfo.number - prevBlockInfo.number)
        setAverageBlockTime(Number((averageBlock * 1000).toFixed(0)))
      })
  }, [blockNumber, chainId, provider])

  return averageBlockTime
}
