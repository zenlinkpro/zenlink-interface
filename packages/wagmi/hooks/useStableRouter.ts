import { ParachainId } from '@zenlink-interface/chain'
import type { Address } from 'wagmi'
import { useWalletClient } from 'wagmi'
import { useMemo } from 'react'
import { getContract } from 'wagmi/actions'
import { stableRouter } from '../abis'

const stableRouters: Record<number, string> = {
  [ParachainId.ASTAR]: '0x7F12564eca712fa59b0EEdfE56EABC8b53a7B0cd',
  [ParachainId.MOONBEAM]: '0x9823eB09c8e368F98c3dA2F6174710D88dE90eEE',
  [ParachainId.MOONRIVER]: '0xE04B18eFF27B55A3BB7E4451C0829Daf594843fD',
}

export function getStableRouterContractConfig(chainId: number | undefined) {
  return {
    address: stableRouters[chainId ?? -1] as Address,
    abi: stableRouter,
  }
}

export function useStableRouterContract(chainId: number | undefined) {
  const { data: signerOrProvider } = useWalletClient()

  return useMemo(() => {
    if (!chainId || !(chainId in stableRouters))
      return

    return getContract({
      ...getStableRouterContractConfig(chainId),
      walletClient: signerOrProvider ?? undefined,
    })
  }, [chainId, signerOrProvider])
}
