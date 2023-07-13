import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useMemo } from 'react'
import type { Address, useContractReads } from 'wagmi'
import { useContractRead } from 'wagmi'
import { formatBytes32String } from 'ethers/lib/utils'
import { AddressZero } from '@ethersproject/constants'
import { referralStorage } from '../../abis'
import { ReferralStorageContractAddresses } from './config'

interface UseCodeCheckParams {
  code: string
  chainId?: ParachainId
  enabled?: boolean
  watch?: boolean
}

type UseCodeCheck = (params: UseCodeCheckParams) => (
  | Pick<ReturnType<typeof useContractReads>, 'isError' | 'isLoading'>
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
    args: [formatBytes32String(code) as Address],
  } as const), [chainId, code])

  const { data, isLoading, isError } = useContractRead({
    ...contract,
    enabled,
    watch: !(typeof enabled !== 'undefined' && !enabled) && watch,
  })

  return useMemo(() => ({
    data: { alreadyTaken: data ? data !== AddressZero : false },
    isLoading,
    isError,
  }), [data, isError, isLoading])
}
