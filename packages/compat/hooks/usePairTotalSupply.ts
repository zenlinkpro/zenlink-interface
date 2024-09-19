import type { Pair } from '@zenlink-interface/amm'
import { ParachainId } from '@zenlink-interface/chain'
import { usePairTotalSupply as useAmplitudePairTotalSupply } from '@zenlink-interface/parachains-amplitude'
import { usePairTotalSupply as useBifrostPairTotalSupply } from '@zenlink-interface/parachains-bifrost'
import { usePairTotalSupply as useWagmiPairTotalSupply } from '@zenlink-interface/wagmi'
import { useMemo } from 'react'
import { isEvmNetwork, isSubstrateNetwork } from '../config'

export function usePairTotalSupply(pair: Pair | undefined | null, chainId: ParachainId) {
  const wagmiPairTotalSupply = useWagmiPairTotalSupply(pair, chainId)
  const bifrostPairTotalSupply = useBifrostPairTotalSupply(pair, chainId, isSubstrateNetwork(chainId))
  const amplitudePairTotalSupply = useAmplitudePairTotalSupply(pair, chainId, isSubstrateNetwork(chainId))

  return useMemo(() => {
    if (isEvmNetwork(chainId))
      return wagmiPairTotalSupply

    if (chainId === ParachainId.AMPLITUDE || chainId === ParachainId.PENDULUM)
      return amplitudePairTotalSupply
    else
      return bifrostPairTotalSupply
  }, [amplitudePairTotalSupply, bifrostPairTotalSupply, chainId, wagmiPairTotalSupply])
}
