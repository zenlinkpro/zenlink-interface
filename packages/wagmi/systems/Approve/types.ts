import type { ButtonProps, NotificationData } from '@zenlink-interface/ui'
import type { ReactElement } from 'react'

import type { ApprovalState } from '../../hooks'
import type { ApprovalAction } from './Approve'

export interface ApprovalButtonRenderProp {
  onApprove: () => void
  approvalState: ApprovalState
}

export interface ApproveButton<T> extends Omit<ButtonProps<'button'>, 'onClick'> {
  dispatch?: (payload: ApprovalAction) => void
  index?: number
  render?: (renderProps: T) => ReactElement
  initialized?: boolean
  allApproved?: boolean
  hideIcon?: boolean
  onSuccess?: (data: NotificationData) => void
  enabled?: boolean
}
