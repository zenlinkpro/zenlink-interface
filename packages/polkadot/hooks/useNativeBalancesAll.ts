import type { DeriveBalancesAll } from '@polkadot/api-derive/types'
import { usePolkadotApi } from '../components'
import { useCall } from './useCall'

export function useNativeBalancesAll(accountAddress: string): DeriveBalancesAll | undefined {
  const { api } = usePolkadotApi()

  return useCall<DeriveBalancesAll>(api.derive.balances?.all, [accountAddress])
}
