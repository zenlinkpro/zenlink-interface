import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useBlockNumber as useWagmiBlockNumber } from 'wagmi'

export function useBlockNumber(chainId: ParachainId | undefined) {
  const { data } = useWagmiBlockNumber({
    chainId: chainsParachainIdToChainId[chainId ?? -1],
    watch: true,
  })

  return data
}
