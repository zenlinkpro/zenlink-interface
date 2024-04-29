import { ParachainId } from '@zenlink-interface/chain'
import { useMemo } from 'react'
import type { Address } from 'viem'
import { actionRouter } from '../../abis'

const marketActionRouters: Record<number, string> = {
  [ParachainId.MOONBEAM]: '0x54FDB8d9143Cf96CE831a2672304EE0fD715759e',
}

export function getMarketActionRouterContract(chainId: number | undefined) {
  return {
    address: marketActionRouters[chainId ?? -1] as Address,
    abi: actionRouter,
  }
}

export function useMarketActionRouterContract(chainId: number | undefined) {
  return useMemo(() => {
    if (!chainId || !(chainId in actionRouter))
      return undefined

    return getMarketActionRouterContract(chainId)
  }, [chainId])
}
