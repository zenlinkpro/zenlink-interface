import type { Call } from '@polkadot/types/interfaces'
import type { ICompact, INumber } from '@polkadot/types/types'
import type { BN } from '@polkadot/util'
import { useEffect, useState } from 'react'
import { BN_ZERO, isFunction, nextTick, objectSpread } from '@polkadot/util'
import { useIsMounted } from '@zenlink-interface/hooks'
import { useApi } from './useApi'

type V1Weight = INumber

interface V2Weight {
  refTime: ICompact<INumber>
  proofSize: ICompact<INumber>
}

interface V2WeightConstruct {
  refTime: BN | ICompact<INumber>
}

interface Result {
  encodedCallLength: number
  isWeightV2: boolean
  v1Weight: BN
  v2Weight: V2WeightConstruct
  weight: BN | V2WeightConstruct
}

// a random address that we are using for our queries
const ZERO_ACCOUNT = '5CAUdnwecHGxxyr5vABevAfZ34Fi4AaraDRMwfDQXQ52PXqg'
const EMPTY_STATE: Partial<Result> = {
  encodedCallLength: 0,
  v1Weight: BN_ZERO,
  v2Weight: { refTime: BN_ZERO },
  weight: BN_ZERO,
}

// return both v1 & v2 weight structures (would depend on actual use)
export function convertWeight(weight: V1Weight | V2Weight): { v1Weight: BN, v2Weight: V2WeightConstruct } {
  if ((weight as V2Weight).proofSize) {
    const refTime = (weight as V2Weight).refTime.toBn()

    return { v1Weight: refTime, v2Weight: weight as V2Weight }
  }

  const refTime = (weight as V1Weight).toBn()

  return { v1Weight: refTime, v2Weight: { refTime } }
}

// for a given call, calculate the weight
export function useWeight(chainId: number, call?: Call | null): Result {
  const api = useApi(chainId)
  const isMounted = useIsMounted()
  const [state, setState] = useState<Result>(() => objectSpread({
    isWeightV2: !isFunction(api?.registry.createType('Weight').toHex),
  }, EMPTY_STATE))

  useEffect((): void => {
    if (api && call && api.call.transactionPaymentApi) {
      nextTick(async () => {
        try {
          const { v1Weight, v2Weight } = convertWeight(
            (await api.tx(call).paymentInfo(ZERO_ACCOUNT)).weight,
          )

          isMounted && setState(prev => objectSpread(
            {},
            prev,
            {
              encodedCallLength: call.encodedLength,
              v1Weight,
              v2Weight,
              weight: prev.isWeightV2
                ? v2Weight
                : v1Weight,
            }),
          )
        }
        catch (error) {
          console.error(error)
        }
      })
    }
    else {
      setState(prev => objectSpread({}, prev, EMPTY_STATE))
    }
  }, [api, call, isMounted])

  return state
}
