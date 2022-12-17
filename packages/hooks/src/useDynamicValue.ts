import { useEffect, useMemo, useState } from 'react'

// A temporary solution to solve React Hydration Error on Next.js
// details: https://nextjs.org/docs/messages/react-hydration-error
export function useDynamicValue<T extends U, U>(value: T, defaultValue: U) {
  const [updated, setUpdated] = useState(false)

  useEffect(() => { setUpdated(true) }, [])

  return useMemo(
    () => updated ? value : { ...value, ...defaultValue },
    [defaultValue, updated, value],
  )
}
