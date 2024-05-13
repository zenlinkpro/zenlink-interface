import type { ParachainId } from '@zenlink-interface/chain'

import { tokenLists } from './token-lists'

interface Props {
  chainId: ParachainId
}

// Wagmi wrapper for redux token lists
export function Updater({ chainId }: Props) {
  return <tokenLists.Updater chainId={chainId} />
}
