import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useMemo } from 'react'
import { useBlockNumber as useWagmiBlockNumber } from 'wagmi'

export const useBlockNumber = (chainId: ParachainId) => {
  const blockNumber = useWagmiBlockNumber({
    chainId: chainsParachainIdToChainId[chainId],
  })

  return useMemo(() => {
    return blockNumber.data
  }, [blockNumber])
}
