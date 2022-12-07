import type { BlockNumber } from '@polkadot/types/interfaces'
import { usePolkadotApi } from '../components'
import { useCall } from './useCall'

export function useBlockNumber(): BlockNumber | undefined {
  const { api } = usePolkadotApi()

  return useCall<BlockNumber>(api.derive.chain.bestNumber)
}
