import type { DeriveBalancesAll } from '@polkadot/api-derive/types'

import { useAccount } from './useAccount'
import { useApi } from './useApi'
import { useCall } from './useCall'

export function useNativeBalancesAll(
  chainId?: number,
  accountAddress?: string,
  enabled = true,
): DeriveBalancesAll | undefined {
  const api = useApi(chainId)
  const { isAccount } = useAccount()

  return useCall<DeriveBalancesAll>({
    fn: api?.derive.balances?.all,
    chainId,
    params: isAccount(accountAddress) ? [accountAddress] : null,
    options: { enabled: enabled && !!api && isAccount(accountAddress) },
  })
}
