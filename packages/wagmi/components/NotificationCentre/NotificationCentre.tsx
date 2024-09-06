import { BellIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Button, Drawer, IconButton, Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'

import { Trans } from '@lingui/macro'
import { NotificationGroup } from './NotificationGroup'
import type { CreateNotificationParams, NotificationType } from './types'

interface ProviderProps {
  notifications: Record<number, string[]>
  clearNotifications: () => void
  createNotification: (type: NotificationType, params: CreateNotificationParams) => void
}

export const NotificationCentre: FC<Omit<ProviderProps, 'createNotification'>> = ({
  notifications,
  clearNotifications,
}) => {
  return (
    <Drawer.Root>
      <Drawer.Button className="bg-slate-700 hover:ring-2 ring-slate-600 cursor-pointer h-[36px] w-[36px] flex items-center justify-center rounded-xl">
        <BellIcon height={20} width={20} />
      </Drawer.Button>
      <Drawer.Panel>
        <div className="flex gap-3 items-center mb-3 h-[54px] border-b border-slate-200/5">
          <Typography className="text-slate-50" variant="lg" weight={500}>
            <Trans>Notifications</Trans>
          </Typography>
          <Button className="!px-0" onClick={clearNotifications} size="sm" variant="empty">
            <Trans>Clear</Trans>
          </Button>
          <div className="absolute right-4 top-4">
            <Drawer.Button>
              <IconButton as="div" className="cursor-pointer">
                <XMarkIcon height={20} width={20} />
              </IconButton>
            </Drawer.Button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {Object.entries(notifications).reverse().map(([, notifications], index) => {
            return <NotificationGroup key={index} notifications={notifications} />
          })}
        </div>
      </Drawer.Panel>
    </Drawer.Root>
  )
}
