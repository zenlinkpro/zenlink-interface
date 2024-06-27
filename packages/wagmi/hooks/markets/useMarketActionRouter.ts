import { ParachainId } from '@zenlink-interface/chain'
import { useMemo } from 'react'
import type { Address } from 'viem'
import { actionRouter } from '../../abis'

const marketActionRouters: Record<number, Address> = {
  [ParachainId.MOONBEAM]: '0x4F49DeC9f28b3FCc56C9c900370D75efa8Db1eCF',
}

export function getMarketActionRouterContract(chainId: number | undefined) {
  return {
    address: marketActionRouters[chainId ?? -1],
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
