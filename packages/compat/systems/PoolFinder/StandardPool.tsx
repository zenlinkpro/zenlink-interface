import type { FC } from 'react'
import type { StandardPoolFinderProps } from './types'

import { useEffect } from 'react'
import { usePair } from '../../hooks'
import { PoolFinderType } from './types'

export const StandardPool: FC<StandardPoolFinderProps> = ({ chainId, dispatch, token0, token1, index }) => {
  const { data: state } = usePair(chainId, token0, token1)

  useEffect(() => {
    if (!dispatch || index === undefined)
      return

    dispatch({
      type: 'update',
      payload: {
        state,
        index,
        poolType: PoolFinderType.Standard,
      },
    })
  }, [dispatch, index, state])

  return <></>
}
