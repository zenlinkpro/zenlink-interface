import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useMemo } from 'react'
import type { useContractReads } from 'wagmi'
import { useContractRead } from 'wagmi'
import ReferralStorageABI from '../../abis/referralStorage.json'
import { ReferralStorageContractAddresses } from './config'

interface UseOwnedCodesParams {
  account: string | undefined
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type UseOwnedCodes = (params: UseOwnedCodesParams) => (
  | Pick<ReturnType<typeof useContractReads>, 'isError' | 'isLoading'>
) & {
  data: string[]
}

export const useOwnedCodes: UseOwnedCodes = ({
  account,
  chainId,
  enabled = true,
  watch = true,
}) => {
  const contract = useMemo(() => ({
    chainId: chainsParachainIdToChainId[chainId ?? -1],
    address: ReferralStorageContractAddresses[chainId ?? -1],
    abi: ReferralStorageABI,
    functionName: 'getOwnedCodes',
    args: [account],
  }), [account, chainId])

  const { data, isLoading, isError } = useContractRead({
    ...contract,
    enabled,
    watch: !(typeof enabled !== undefined && !enabled) && watch,
    keepPreviousData: true,
  })

  return useMemo(() => ({
    data: (data || []) as string[],
    isLoading,
    isError,
  }), [data, isError, isLoading])
}
