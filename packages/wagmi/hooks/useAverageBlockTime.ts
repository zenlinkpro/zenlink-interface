import type { ParachainId } from '@zenlink-interface/chain'
import { useEffect, useState } from 'react'
import { useBlock } from 'wagmi'
import { useBlockNumber } from './useBlockNumber'

const BLOCKS = 5000

export function useAverageBlockTime(chainId: ParachainId) {
  const [averageBlockTime, setAverageBlockTime] = useState(0)
  const blockNumber = useBlockNumber(chainId)
  const { data: currentBlock } = useBlock({ blockNumber })
  const { data: prevBlock } = useBlock({ blockNumber: blockNumber && blockNumber - BigInt(BLOCKS) })

  useEffect(() => {
    if (currentBlock && prevBlock && currentBlock.hash !== prevBlock.hash) {
      const averageBlock = (currentBlock.timestamp - prevBlock.timestamp) / (currentBlock.number - prevBlock.number)
      setAverageBlockTime(Number((Number(averageBlock) * 1000).toFixed(0)))
    }
  }, [currentBlock, prevBlock])

  return averageBlockTime
}
