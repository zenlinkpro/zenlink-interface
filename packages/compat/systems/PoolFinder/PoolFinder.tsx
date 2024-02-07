import type { FC, ReactElement, ReactNode } from 'react'
import { Children, cloneElement, isValidElement, useMemo, useReducer } from 'react'

import { PairState } from '../../hooks'
import { ComponentsWrapper } from './ComponentsWrapper'
import { StandardPool } from './StandardPool'
import type {
  ComponentsWrapperProps,
  PoolExistenceStateAction,
  PoolStateUnion,
  StandardPoolFinderProps,
} from './types'

interface Props {
  components: ReactElement<ComponentsWrapperProps<StandardPoolFinderProps>>
  children: ({ pool }: { pool: PoolStateUnion }) => ReactNode
}

export interface PoolFinderState {
  pool: PoolStateUnion
}

function reducer(state: PoolFinderState, action: PoolExistenceStateAction) {
  switch (action.type) {
    case 'update': {
      return {
        pool: action.payload.state,
      }
    }
  }
}

const Controller: FC<Props> = ({ components, children }) => {
  const [state, dispatch] = useReducer(reducer, { pool: [PairState.LOADING, null] })

  const childrenComponents = useMemo(() => {
    return cloneElement(
      components,
      components.props,
      Children.map(components.props.children, (component, index) => {
        if (isValidElement(component) && component.props.enabled) {
          return cloneElement(component, {
            dispatch,
            index,
          })
        }
      }),
    )
  }, [components])

  return (
    <>
      {children(state)}
      {childrenComponents}
    </>
  )
}

export const PoolFinder: typeof Controller & {
  Components: typeof ComponentsWrapper
  StandardPool: typeof StandardPool
} = Object.assign(Controller, {
  Components: ComponentsWrapper,
  StandardPool,
})
