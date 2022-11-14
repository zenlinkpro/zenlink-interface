import standardRouterABI from '@zenlink-dex/zenlink-evm-contracts/abi/Router.json'
import { ParachainId } from '@zenlink-interface/chain'
import type { Signer } from 'ethers'
import { useMemo } from 'react'
import { useSigner } from 'wagmi'
import { getContract } from 'wagmi/actions'

const standardRouters: Record<number, string> = {
  [ParachainId.ASTAR]: '0xf5016C2DF297457a1f9b036990cc704306264B40',
  [ParachainId.MOONBEAM]: '0x5C93cBF67C74daf14E36002D955eD5C7BD49887A',
  [ParachainId.MOONRIVER]: '0x1006Fff14E20fCc7D5975D4e81421bEcfb242Fa6',
}

export const getStandardRouterContractConfig = (chainId: number | undefined) => ({
  address: standardRouters[chainId ?? -1] ?? '',
  abi: standardRouterABI,
})

export function useStandardRouterContract(chainId: number | undefined) {
  const { data: signerOrProvider } = useSigner()
  return useMemo(() => {
    if (!chainId || !(chainId in standardRouters))
      return
    return getContract({
      ...getStandardRouterContractConfig(chainId),
      signerOrProvider: signerOrProvider as Signer,
    })
  }, [chainId, signerOrProvider])
}
