import { useIsMounted } from '@zenlink-interface/hooks'
import type { NotificationData } from '@zenlink-interface/ui'
import { classNames } from '@zenlink-interface/ui'
import type { FC, ReactElement, ReactNode } from 'react'
import { Children, cloneElement, isValidElement, useMemo, useReducer } from 'react'

import { Approve as WagmiApprove } from '@zenlink-interface/wagmi'
import { isSubstrateNetwork } from '../../config'
import type { TokenApproveButtonProps } from './TokenApproveButton'
import { TokenApproveButton } from './TokenApproveButton'
import { ApprovalState } from './types'
import type { ApproveButton } from './types'

interface Props {
  className?: string
  chainId: number
  components: ReactElement<ApproveButton<'button'>>
  render({ isUnknown, approved }: { approved: boolean | undefined, isUnknown: boolean | undefined }): ReactNode
  onSuccess(data: NotificationData): void
}

export interface State {
  approvals: ([ApprovalState, ReactElement | undefined, boolean] | undefined)[]
  length: number
  isUnknown: boolean
  isApproved: boolean
  isPending: boolean
}

export type ApprovalAction =
  | { type: 'update', payload: { state: [ApprovalState, ReactElement | undefined, boolean], index: number } }
  | { type: 'remove', payload: { index: number } }

function reducer(state: State, action: ApprovalAction) {
  switch (action.type) {
    case 'update': {
      const approvals = [...state.approvals]
      approvals[action.payload.index] = action.payload.state
      const isUnknown = approvals.some(el => el?.[0] === ApprovalState.UNKNOWN)
      const isPending = approvals.some(el => el?.[0] === ApprovalState.PENDING)
      const isApproved = approvals.every(
        el => el?.[0] === ApprovalState.APPROVED || (el?.[0] === ApprovalState.PENDING && el?.[2]),
      )
      return { ...state, approvals, isUnknown, isApproved, isPending }
    }
    case 'remove': {
      const approvals = [...state.approvals]
      approvals.splice(action.payload.index, 1)
      const isUnknown = approvals.some(el => el?.[0] === ApprovalState.UNKNOWN)
      const isPending = approvals.some(el => el?.[0] === ApprovalState.PENDING)
      const isApproved = approvals.every(
        el => el?.[0] === ApprovalState.APPROVED || (el?.[0] === ApprovalState.PENDING && el?.[2]),
      )
      return { ...state, approvals, isUnknown, isApproved, isPending }
    }
  }
}

const Controller: FC<Props> = ({ className, components, render, onSuccess, chainId }) => {
  const isMounted = useIsMounted()
  const [state, dispatch] = useReducer(reducer, {
    approvals: [],
    length: Children.count(components.props.children),
    isApproved: false,
    isUnknown: true,
    isPending: false,
  })

  const initialized
    = state.approvals.length === Children.toArray(components.props.children).length
    && !state.approvals.some(el => el?.[0] === ApprovalState.UNKNOWN)

  const children = useMemo(() => {
    return cloneElement(
      components,
      components.props,
      Children.map(components.props.children, (component, index) => {
        if (isValidElement<TokenApproveButtonProps>(component)) {
          return cloneElement(component, {
            dispatch,
            index,
            allApproved: state.isApproved,
            initialized,
            onSuccess,
          })
        }
        return null
      }),
    )
  }, [components, initialized, onSuccess, state.isApproved])

  const button = useMemo(() => {
    const index = state.approvals.findIndex(el => el?.[0] === ApprovalState.NOT_APPROVED)
    if (state.approvals && index !== undefined && index >= 0 && state.approvals[index])
      return state.approvals[index]?.[1]

    return render({ approved: state.isApproved && initialized, isUnknown: state.isUnknown && initialized })
  }, [initialized, render, state.approvals, state.isApproved, state.isUnknown])

  // Only render renderProp since we can't get approval states on the server anyway
  if (!isMounted)
    return <>{render({ approved: state.isApproved, isUnknown: true })}</>

  if (isSubstrateNetwork(chainId))
    return <>{render({ approved: true, isUnknown: false })}</>

  return (
    <div className={classNames(className, 'flex flex-col justify-center items-center w-full')}>
      {children}
      {button}
    </div>
  )
}

export const Approve: typeof Controller & {
  Components: typeof WagmiApprove.Components
  Token: typeof TokenApproveButton
} = Object.assign(Controller, {
  Components: WagmiApprove.Components,
  Token: TokenApproveButton,
})
