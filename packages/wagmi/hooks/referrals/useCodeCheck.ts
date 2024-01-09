import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useEffect, useMemo } from 'react'
import { useReadContract, type useReadContracts } from 'wagmi'
import { type Address, stringToHex, zeroAddress } from 'viem'
import { referralStorage } from '../../abis'
import { useBlockNumber } from '../useBlockNumber'
import { ReferralStorageContractAddresses } from './config'

interface UseCodeCheckParams {
  code: string
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type UseCodeCheck = (params: UseCodeCheckParams) => (
  | Pick<ReturnType<typeof useReadContracts>, 'isError' | 'isLoading'>
) & {
  data: { alreadyTaken: boolean }
}

export const useCodeCheck: UseCodeCheck = ({
  code,
  chainId,
  enabled = true,
  watch = true,
}) => {
  const contract = useMemo(() => ({
    chainId: chainsParachainIdToChainId[chainId ?? -1],
    address: ReferralStorageContractAddresses[chainId ?? -1] as Address,
    abi: referralStorage,
    functionName: 'codeOwners',
    args: [stringToHex(code)],
  } as const), [chainId, code])

  const blockNumber = useBlockNumber(chainId)
  const { data, isLoading, isError, refetch } = useReadContract({ ...contract })

  useEffect(() => {
    if (enabled && watch && blockNumber)
      refetch()
  }, [blockNumber, enabled, refetch, watch])

  return useMemo(() => ({
    data: { alreadyTaken: data ? data !== zeroAddress : false },
    isLoading,
    isError,
  }), [data, isError, isLoading])
}
