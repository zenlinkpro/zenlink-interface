import type { ParachainId } from '@zenlink-interface/chain'

import { Updater } from './TokenListsUpdater'

interface Props {
  chainIds: ParachainId[]
}

export function Updaters({ chainIds }: Props) {
  return (
    <>
      {chainIds.map(chainId => (
        <Updater chainId={chainId} key={chainId} />
      ))}
    </>
  )
}
