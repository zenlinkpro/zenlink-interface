import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useBlockNumber as useWagmiBlockNumber } from 'wagmi'

export function useBlockNumber(chainId: ParachainId) {
  const { data } = useWagmiBlockNumber({
    chainId: chainsParachainIdToChainId[chainId],
  })

  return data
}
