import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { WNATIVE_ADDRESS } from '@zenlink-interface/currency'
import { useContract, useProvider } from 'wagmi'

import WNATIVE_ABI from '../abis/wnative.json'

export const getWNATIVEContractConfig = (chainId: number | undefined) => ({
  addressOrName: chainId ? WNATIVE_ADDRESS[chainId] : '',
  contractInterface: WNATIVE_ABI,
})

export function useWNATIVEContract(chainId: number | undefined): ReturnType<typeof useContract> {
  return useContract({
    ...getWNATIVEContractConfig(chainsParachainIdToChainId[chainId ?? -1]),
    signerOrProvider: useProvider({ chainId }),
  })
}
