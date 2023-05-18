import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { usePublicClient } from 'wagmi'

import { tokenLists } from './token-lists'

interface Props {
  chainId: ParachainId
}

// Wagmi wrapper for redux token lists
export function Updater({ chainId }: Props) {
  const provider = usePublicClient({ chainId: chainsParachainIdToChainId[chainId] })
  return <tokenLists.Updater chainId={chainId} provider={provider} />
}
