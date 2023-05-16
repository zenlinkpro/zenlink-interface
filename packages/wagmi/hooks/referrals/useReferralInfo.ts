import { HashZero } from '@ethersproject/constants'
import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { parseBytes32String } from 'ethers/lib/utils.js'
import { useMemo } from 'react'
import type { Address, useContractReads } from 'wagmi'
import { useContractRead } from 'wagmi'
import { referralStorage } from '../../abis'
import { ReferralStorageContractAddresses } from './config'

interface UseReferralInfoParams {
  account: string | undefined
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type UseReferralInfo = (params: UseReferralInfoParams) => (
  | Pick<ReturnType<typeof useContractReads>, 'isError' | 'isLoading'>
) & {
  data: { code: string; referrer: string | undefined } | undefined
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

  const { data, isLoading, isError } = useContractRead({
    ...contract,
    enabled: !!account && enabled,
    watch: !(typeof enabled !== undefined && !enabled) && watch,
  })

  return useMemo(() => {
    const [code, referrer] = (data || []) as Address[]
    return {
      data: (!code || code === HashZero)
        ? undefined
        : { code: parseBytes32String(code), referrer },
      isLoading,
      isError,
    }
  }, [data, isError, isLoading])
}
