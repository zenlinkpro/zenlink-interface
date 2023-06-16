import type { Pair } from '@zenlink-interface/amm'
import type { ParachainId } from '@zenlink-interface/chain'
import { usePairTotalSupply as useWagmiPairTotalSupply } from '@zenlink-interface/wagmi'
import { usePairTotalSupply as useBifrostPairTotalSupply } from '@zenlink-interface/parachains-manta'
import { useMemo } from 'react'
import { isEvmNetwork, isSubstrateNetwork } from '../config'

export const usePairTotalSupply = (pair: Pair | undefined | null, chainId: ParachainId) => {
  const wagmiPairTotalSupply = useWagmiPairTotalSupply(pair, chainId)
  const bifrostPairTotalSupply = useBifrostPairTotalSupply(pair, chainId, isSubstrateNetwork(chainId))

  return useMemo(() => {
    if (isEvmNetwork(chainId))
      return wagmiPairTotalSupply
    return bifrostPairTotalSupply
  }, [bifrostPairTotalSupply, chainId, wagmiPairTotalSupply])
}
