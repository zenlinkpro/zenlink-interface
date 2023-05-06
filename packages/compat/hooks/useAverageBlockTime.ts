import type { ParachainId } from '@zenlink-interface/chain'
import { useAverageBlockTime as useWagmiAverageBlockTime } from '@zenlink-interface/wagmi'
import { useMemo } from 'react'
import { useAverageBlockTime as useSubstrateAverageBlockTime } from '@zenlink-interface/polkadot'
import { isEvmNetwork } from '../config'

export const useAverageBlockTime = (chainId: ParachainId) => {
  const wagmiBlockNumber = useWagmiAverageBlockTime(chainId)
  const substrateBlockNumber = useSubstrateAverageBlockTime(chainId)

  return useMemo(() => {
    if (isEvmNetwork(chainId))
      return wagmiBlockNumber
    return substrateBlockNumber
  }, [chainId, substrateBlockNumber, wagmiBlockNumber])
}
