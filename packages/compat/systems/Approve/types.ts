import type { ButtonProps, NotificationData } from '@zenlink-interface/ui'
import type { ReactElement } from 'react'

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

export type ApprovalAction =
  | { type: 'update'; payload: { state: [ApprovalState, ReactElement | undefined, boolean]; index: number } }
  | { type: 'remove'; payload: { index: number } }

export interface ApprovalButtonRenderProp {
  onApprove(): void
  approvalState: ApprovalState
}

export interface ApproveButton<T> extends Omit<ButtonProps<'button'>, 'onClick'> {
  dispatch?(payload: ApprovalAction): void
  index?: number
  render?: (renderProps: T) => ReactElement
  initialized?: boolean
  allApproved?: boolean
  hideIcon?: boolean
  onSuccess?(data: NotificationData): void
  enabled?: boolean
}
