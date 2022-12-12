import type { NotificationData } from '@zenlink-interface/ui'
import {
  createFailedToast,
  createInfoToast,
  createInlineToast,
  createPendingToast,
  createSuccessToast,
  createToast,
} from '@zenlink-interface/ui'
import stringify from 'fast-json-stable-stringify'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import type { StorageContext } from '../context'
import type { WithStorageState } from '../types'

type UseNotificationsReturn = [
  Record<number, string[]>,
  {
    createNotification(notification: NotificationData): void
    createInlineNotification(notification: NotificationData): void
    createPendingNotification(notification: Omit<NotificationData, 'promise'>): void
    createSuccessNotification(notification: Omit<NotificationData, 'promise'>): void
    createFailedNotification(notification: Omit<NotificationData, 'promise'>): void
    createInfoNotification(notification: Omit<NotificationData, 'promise'>): void
    clearNotifications(): void
  },
]

type UseNotifications = (context: StorageContext, account: string | undefined) => UseNotificationsReturn

export const useNotifications: UseNotifications = (context, account) => {
  const { reducerPath, actions } = context
  const dispatch = useDispatch()
  const notifications = useSelector((state: WithStorageState) =>
    account ? state[reducerPath].notifications[account] : {},
  )

  const createNotification = useCallback(
    ({ promise, ...rest }: NotificationData) => {
      const { groupTimestamp } = rest
      createToast({ ...rest, promise })
      dispatch(actions.createNotification({ account, notification: stringify(rest), timestamp: groupTimestamp }))
    },
    [account, actions, dispatch],
  )

  const createPendingNotification = useCallback(
    (rest: NotificationData) => {
      const { groupTimestamp } = rest
      createPendingToast(rest)
      dispatch(actions.createNotification({ account, notification: stringify(rest), timestamp: groupTimestamp }))
    },
    [account, actions, dispatch],
  )

  const createSuccessNotification = useCallback(
    (rest: NotificationData) => {
      const { groupTimestamp } = rest
      createSuccessToast(rest)
      dispatch(actions.createNotification({ account, notification: stringify(rest), timestamp: groupTimestamp }))
    },
    [account, actions, dispatch],
  )

  const createFailedNotification = useCallback(
    (rest: NotificationData) => {
      const { groupTimestamp } = rest
      createFailedToast(rest)
      dispatch(actions.createNotification({ account, notification: stringify(rest), timestamp: groupTimestamp }))
    },
    [account, actions, dispatch],
  )

  const createInfoNotification = useCallback(
    (rest: NotificationData) => {
      const { groupTimestamp } = rest
      createInfoToast(rest)
      dispatch(actions.createNotification({ account, notification: stringify(rest), timestamp: groupTimestamp }))
    },
    [account, actions, dispatch],
  )

  const createInlineNotification = useCallback(
    ({ promise, ...rest }: NotificationData) => {
      const { groupTimestamp } = rest
      createInlineToast({ ...rest, promise })
      dispatch(actions.createNotification({ account, notification: stringify(rest), timestamp: groupTimestamp }))
    },
    [account, actions, dispatch],
  )

  const clearNotifications = useCallback(() => {
    dispatch(actions.clearNotifications({ account }))
  }, [account, actions, dispatch])

  return [
    notifications || {},
    {
      createNotification,
      clearNotifications,
      createInlineNotification,
      createPendingNotification,
      createSuccessNotification,
      createFailedNotification,
      createInfoNotification,
    },
  ]
}
