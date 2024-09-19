import type { ParachainId } from '@zenlink-interface/chain'
import { encodeAddress } from '@polkadot/util-crypto'
import { chains, isSubstrateNetwork } from '@zenlink-interface/chain'

export function encodeChainAddress(address: string, chainId: ParachainId) {
  return isSubstrateNetwork(chainId) ? encodeAddress(address, chains[chainId]?.prefix) : address
}
