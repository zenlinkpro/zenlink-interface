import type { Options } from '@popperjs/core'
import type { RefCallback } from 'react'
import { createPopper } from '@popperjs/core'
import { useCallback, useMemo, useRef } from 'react'

/**
 * Example implementation to use Popper: https://popper.js.org/
 */
export function usePopper(options?: Partial<Options>): [RefCallback<Element | null>, RefCallback<HTMLElement | null>] {
  const reference = useRef<Element | null>(null)
  const popper = useRef<HTMLElement | null>(null)

  const cleanupCallback = useRef(() => {})

  const instantiatePopper = useCallback(() => {
    if (!reference.current)
      return
    if (!popper.current)
      return

    if (cleanupCallback.current)
      cleanupCallback.current()

    cleanupCallback.current = createPopper(reference.current, popper.current, options).destroy
  }, [reference, popper, cleanupCallback, options])

  return useMemo(
    () => [
      (referenceDomNode) => {
        reference.current = referenceDomNode
        instantiatePopper()
      },
      (popperDomNode) => {
        popper.current = popperDomNode
        instantiatePopper()
      },
    ],
    [reference, popper, instantiatePopper],
  )
}
