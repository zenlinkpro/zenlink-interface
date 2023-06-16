import { ParachainId } from '@zenlink-interface/chain'
import { useMemo } from 'react'

import { Native } from './Native'

export function useNativeCurrency({ chainId = ParachainId.CALAMARI_KUSAMA }: { chainId?: number }): Native {
  return useMemo(() => Native.onChain(chainId), [chainId])
}
