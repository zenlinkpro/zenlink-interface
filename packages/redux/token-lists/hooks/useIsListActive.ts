import type { TokenListsContext } from '../context'
import { useActiveListNames } from './useActiveListNames'

export function useIsListActive(context: TokenListsContext, name: string): boolean {
  const activeListUrls = useActiveListNames(context)
  return Boolean(activeListUrls?.includes(name))
}
