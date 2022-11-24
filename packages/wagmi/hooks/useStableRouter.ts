import { ParachainId } from '@zenlink-interface/chain'
import stableRouterABI from '@zenlink-dex/zenlink-evm-contracts/abi/StableSwapRouter.json'
import { useSigner } from 'wagmi'
import { useMemo } from 'react'
import { getContract } from 'wagmi/actions'
import type { Signer } from 'ethers'

const stableRouters: Record<number, string> = {
  [ParachainId.ASTAR]: '0x7F12564eca712fa59b0EEdfE56EABC8b53a7B0cd',
  [ParachainId.MOONBEAM]: '0x9823eB09c8e368F98c3dA2F6174710D88dE90eEE',
  [ParachainId.MOONRIVER]: '0xE04B18eFF27B55A3BB7E4451C0829Daf594843fD',
}

export const getStableRouterContractConfig = (chainId: number | undefined) => ({
  address: stableRouters[chainId ?? -1] ?? '',
  abi: stableRouterABI,
})

export function useStableRouterContract(chainId: number | undefined) {
  const { data: signerOrProvider } = useSigner()
  return useMemo(() => {
    if (!chainId || !(chainId in stableRouters))
      return
    return getContract({
      ...getStableRouterContractConfig(chainId),
      signerOrProvider: signerOrProvider as Signer,
    })
  }, [chainId, signerOrProvider])
}
