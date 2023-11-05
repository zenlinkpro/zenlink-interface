import type { ParachainId } from '@zenlink-interface/chain'
import { useBlockNumber as useWagmiBlockNumber } from '@zenlink-interface/wagmi'
import { useMemo } from 'react'
import { useBlockNumber as useSubstrateBlockNumber } from '@zenlink-interface/polkadot'
import { isEvmNetwork } from '../config'

export function useBlockNumber(chainId: ParachainId) {
  const wagmiBlockNumber = useWagmiBlockNumber(chainId)
  const substrateBlockNumber = useSubstrateBlockNumber(chainId)

  return useMemo(() => {
    if (isEvmNetwork(chainId))
      return wagmiBlockNumber ? Number(wagmiBlockNumber) : undefined
    return substrateBlockNumber?.toNumber()
  }, [chainId, substrateBlockNumber, wagmiBlockNumber])
}
