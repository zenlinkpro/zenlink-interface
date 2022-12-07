import { useEffect, useState } from 'react'

import { keyring } from '@polkadot/ui-keyring'
import { nextTick } from '@polkadot/util'

import { useIsMounted } from '@zenlink-interface/hooks'

interface UseAddresses {
  allAddresses: string[]
  hasAddresses: boolean
  isAddress: (address: string) => boolean
}

export function useAddresses() {
  const isMounted = useIsMounted()
  const [state, setState] = useState<UseAddresses>({ allAddresses: [], hasAddresses: false, isAddress: () => false })

  useEffect(() => {
    const subscription = keyring.addresses.subject.subscribe((addresses) => {
      if (isMounted) {
        const allAddresses = addresses ? Object.keys(addresses) : []
        const hasAddresses = allAddresses.length !== 0
        const isAddress = (address: string): boolean => allAddresses.includes(address.toString())

        setState({ allAddresses, hasAddresses, isAddress })
      }
    })

    return () => {
      nextTick(() => subscription.unsubscribe())
    }
  }, [isMounted])

  return state
}
