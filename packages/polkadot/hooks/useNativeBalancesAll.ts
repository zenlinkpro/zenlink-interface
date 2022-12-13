import type { DeriveBalancesAll } from '@polkadot/api-derive/types'
import { useApi } from './useApi'
import { useCall } from './useCall'

export function useNativeBalancesAll(chainId?: number, accountAddress?: string): DeriveBalancesAll | undefined {
  const api = useApi(chainId)

  return useCall<DeriveBalancesAll>({ fn: api?.derive.balances?.all, chainId, params: [accountAddress] })
}
