import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { WNATIVE_ADDRESS } from '@zenlink-interface/currency'
import { useContract, useProvider } from 'wagmi'

import WNATIVE_ABI from '../abis/wnative.json'

export const getWNATIVEContractConfig = (chainId: number | undefined) => ({
  address: chainId ? WNATIVE_ADDRESS[chainId] : '',
  abi: WNATIVE_ABI,
})

export function useWNATIVEContract(chainId: number | undefined): ReturnType<typeof useContract> {
  return useContract({
    ...getWNATIVEContractConfig(chainId),
    signerOrProvider: useProvider({ chainId: chainsParachainIdToChainId[chainId ?? -1] }),
  })
}
