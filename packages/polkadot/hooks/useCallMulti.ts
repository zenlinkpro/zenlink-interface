import type { ApiPromise } from '@polkadot/api'
import type { QueryableStorageMultiArg } from '@polkadot/api/types'
import { useEffect, useRef, useState } from 'react'
import { isUndefined, nextTick } from '@polkadot/util'
import { useIsMounted } from '@zenlink-interface/hooks'
import { usePolkadotApi } from '../components'
import type { Tracker } from './useCall'

import { handleError, transformIdentity, unsubscribe } from './useCall'

interface TrackerRef {
  current: Tracker
}

interface CallOptions<T> {
  defaultValue?: T
  transform?: (value: any, api: ApiPromise) => T
}

// subscribe, trying to play nice with the browser threads
function subscribe<T>(api: ApiPromise, isMounted: boolean, tracker: TrackerRef, calls: QueryableStorageMultiArg<'promise'>[], setValue: (value: T) => void, { transform = transformIdentity }: CallOptions<T> = {}): void {
  unsubscribe(tracker)

  nextTick((): void => {
    if (isMounted) {
      const included = calls.map(c => !!c && (!Array.isArray(c) || !!c[0]))
      const filtered = calls.filter((_, index) => included[index])

      if (filtered.length) {
        // swap to active mode
        tracker.current.isActive = true
        tracker.current.subscriber = api.queryMulti(filtered, (value): void => {
          // we use the isActive flag here since .subscriber may not be set on immediate callback)
          if (isMounted && tracker.current.isActive) {
            let valueIndex = -1

            try {
              setValue(
                transform(
                  calls.map((_, index) =>
                    included[index]
                      ? value[++valueIndex]
                      : undefined,
                  ),
                  api,
                ),
              )
            }
            catch (error) {
              handleError(error as Error, tracker)
            }
          }
        }).catch(error => handleError(error as Error, tracker))
      }
      else {
        tracker.current.subscriber = null
      }
    }
  })
}

// very much copied from useCall
// FIXME This is generic, we cannot really use createNamedHook
export function useCallMulti<T>(calls?: QueryableStorageMultiArg<'promise'>[] | null | false, options?: CallOptions<T>): T {
  const { api } = usePolkadotApi()
  const isMounted = useIsMounted()
  const tracker = useRef<Tracker>({ error: null, fn: null, isActive: false, serialized: null, subscriber: null, type: 'useCallMulti' })
  const [value, setValue] = useState<T>(() => (isUndefined((options || {}).defaultValue) ? [] : (options || {}).defaultValue) as unknown as T)

  // initial effect, we need an un-subscription
  useEffect((): () => void => {
    return () => unsubscribe(tracker)
  }, [])

  // on changes, re-subscribe
  useEffect((): void => {
    // check if we have a function & that we are mounted
    if (isMounted && calls) {
      const serialized = JSON.stringify(calls)

      if (serialized !== tracker.current.serialized) {
        tracker.current.serialized = serialized

        subscribe(api, isMounted, tracker, calls, setValue, options)
      }
    }
  }, [api, calls, options, isMounted])

  // throwOnError(tracker.current);

  return value
}
