import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import { useBlockNumber } from './useBlockNumber'

const BLOCKS = 5000

export function useAverageBlockTime(chainId: ParachainId) {
  const [averageBlockTime, setAverageBlockTime] = useState(0)
  const blockNumber = useBlockNumber(chainId)
  const provider = usePublicClient({
    chainId: chainsParachainIdToChainId[chainId],
  })

  useEffect(() => {
    if (!provider || !blockNumber)
      return

    Promise.all([
      provider.getBlock({ blockNumber }),
      provider.getBlock({ blockNumber: blockNumber - BigInt(BLOCKS) }),
    ])
      .then(([blockInfo, prevBlockInfo]) => {
        if (blockInfo.number && prevBlockInfo.number) {
          const averageBlock
            = (blockInfo.timestamp - prevBlockInfo.timestamp) / (blockInfo.number - prevBlockInfo.number)
          setAverageBlockTime(Number((Number(averageBlock) * 1000).toFixed(0)))
        }
      })
  }, [blockNumber, chainId, provider])

  return averageBlockTime
}
