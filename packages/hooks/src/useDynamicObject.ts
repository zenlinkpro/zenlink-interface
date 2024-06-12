import { useMemo } from 'react'

import { useIsMounted } from './useIsMounted'

// A temporary solution to solve React Hydration Error on Next.js
// details: https://nextjs.org/docs/messages/react-hydration-error
export function useDynamicObject<T extends U, U>(value: T, defaultValue: U) {
  const isMounted = useIsMounted()

  return useMemo(
    () => isMounted ? value : { ...value, ...defaultValue },
    [defaultValue, isMounted, value],
  )
}
