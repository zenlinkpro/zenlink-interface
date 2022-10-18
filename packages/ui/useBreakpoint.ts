import { useMediaQuery } from '@zenlink-interface/hooks'

import tailwindConfig from './tailwind'

type Breackpoints = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const breakpoints = tailwindConfig.theme!.screens as Record<Breackpoints, string>

export function useBreakpoint<K extends Breackpoints>(breakpointKey: K) {
  const bool = useMediaQuery({
    query: `(min-width: ${breakpoints[breakpointKey]})`,
  })
  const capitalizedKey = breakpointKey[0].toUpperCase() + breakpointKey.substring(1)
  type Key = `is${Capitalize<K>}`
  return {
    [`is${capitalizedKey}`]: bool,
  } as Record<Key, boolean>
}
