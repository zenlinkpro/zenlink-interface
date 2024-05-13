import { ParachainId } from '@zenlink-interface/chain'
import { useMemo } from 'react'
import type { Address } from 'viem'
import { actionRouter } from '../../abis'

const marketActionRouters: Record<number, string> = {
  [ParachainId.MOONBEAM]: '0x209c577C526b2844341B0Ce08037D7c803Bfed78',
}

export function getMarketActionRouterContract(chainId: number | undefined) {
  return {
    address: marketActionRouters[chainId ?? -1] as Address,
    abi: actionRouter,
  }
}

export function useMarketActionRouterContract(chainId: number | undefined) {
  return useMemo(() => {
    if (!chainId || !(chainId in marketActionRouters))
      return undefined

    return getMarketActionRouterContract(chainId)
  }, [chainId])
}
