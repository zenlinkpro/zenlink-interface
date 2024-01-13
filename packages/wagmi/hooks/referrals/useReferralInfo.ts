import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useEffect, useMemo } from 'react'
import { useReadContract } from 'wagmi'
import { type Address, hexToString, zeroHash } from 'viem'
import { referralStorage } from '../../abis'
import { useBlockNumber } from '../useBlockNumber'
import { ReferralStorageContractAddresses } from './config'

interface UseReferralInfoParams {
  account: string | undefined
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type UseReferralInfo = (params: UseReferralInfoParams) => (
  | Pick<ReturnType<typeof useReadContract>, 'isError' | 'isLoading'>
) & {
  data: { code: string, referrer: string | undefined } | undefined
}

export const useReferralInfo: UseReferralInfo = ({
  account,
  chainId,
  enabled = true,
  watch = true,
}) => {
  const contract = useMemo(() => ({
    chainId: chainsParachainIdToChainId[chainId ?? -1],
    address: ReferralStorageContractAddresses[chainId ?? -1] as Address,
    abi: referralStorage,
    functionName: 'getReferralInfo',
    args: [account as Address],
  } as const), [account, chainId])

  const blockNumber = useBlockNumber(chainId)
  const { data, isLoading, isError, refetch } = useReadContract({ ...contract })

  useEffect(() => {
    if (enabled && watch && blockNumber)
      refetch()
  }, [blockNumber, enabled, refetch, watch])

  return useMemo(() => {
    const [code, referrer] = (data || []) as Address[]
    return {
      data: (!code || code === zeroHash)
        ? undefined
        : { code: hexToString(code), referrer },
      isLoading,
      isError,
    }
  }, [data, isError, isLoading])
}
