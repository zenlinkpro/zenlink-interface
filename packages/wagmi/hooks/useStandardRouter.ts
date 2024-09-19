import type { Address } from 'viem'
import { ParachainId } from '@zenlink-interface/chain'
import { useMemo } from 'react'
import { routerABI } from '../abis'

const standardRouters: Record<number, string> = {
  [ParachainId.ASTAR]: '0xf5016C2DF297457a1f9b036990cc704306264B40',
  [ParachainId.MOONBEAM]: '0x5C93cBF67C74daf14E36002D955eD5C7BD49887A',
  [ParachainId.MOONRIVER]: '0x1006Fff14E20fCc7D5975D4e81421bEcfb242Fa6',
}

export function getStandardRouterContractConfig(chainId: number | undefined) {
  return {
    address: standardRouters[chainId ?? -1] as Address,
    abi: routerABI,
  }
}

export function useStandardRouterContract(chainId: number | undefined) {
  return useMemo(() => {
    if (!chainId || !(chainId in standardRouters))
      return undefined

    return getStandardRouterContractConfig(chainId)
  }, [chainId])
}
