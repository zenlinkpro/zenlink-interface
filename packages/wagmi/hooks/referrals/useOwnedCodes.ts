import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useMemo } from 'react'
import type { Address, useContractReads } from 'wagmi'
import { useContractRead } from 'wagmi'
import { referralStorage } from '../../abis'
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
    address: ReferralStorageContractAddresses[chainId ?? -1] as Address,
    abi: referralStorage,
    functionName: 'getOwnedCodes',
    args: [account as Address],
  } as const), [account, chainId])

  const { data, isLoading, isError } = useContractRead({
    ...contract,
    enabled: !!account && enabled,
    watch: !(typeof enabled !== undefined && !enabled) && watch,
  })

  return useMemo(() => ({
    data: (data || []) as string[],
    isLoading,
    isError,
  }), [data, isError, isLoading])
}
