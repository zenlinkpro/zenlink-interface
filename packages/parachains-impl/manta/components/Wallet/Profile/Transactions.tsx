import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { Button, IconButton, Typography } from '@zenlink-interface/ui'
import type { Dispatch, FC, SetStateAction } from 'react'

import { Trans } from '@lingui/macro'
import { NotificationGroup } from '../../NotificationCentre'
import { ProfileView } from './Profile'

interface TransactionsProps {
  setView: Dispatch<SetStateAction<ProfileView>>
  notifications: Record<number, string[]>
  clearNotifications(): void
}

export const Transactions: FC<TransactionsProps> = ({ setView, notifications, clearNotifications }) => {
  return (
    <div>
      <div className="grid grid-cols-3 items-center h-12 border-b border-slate-500/20 dark:border-slate-200/20 px-2">
        <div className="flex items-center">
          <IconButton onClick={() => setView(ProfileView.Default)}>
            <ChevronLeftIcon width={24} height={24} className="text-slate-400" />
          </IconButton>
        </div>
        <Typography weight={600} className="text-slate-500">
          <Trans>Transactions</Trans>
        </Typography>
        <div className="flex items-end justify-end">
          <Button onClick={clearNotifications} variant="empty" size="sm" className="!p-0">
            <Trans>Clear all</Trans>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-2 max-h-[300px] scroll">
        {Object.entries(notifications).length > 0
          ? (
              Object.entries(notifications)
                .reverse()
                .map(([, notifications], index) => {
                  return <NotificationGroup key={index} notifications={notifications} />
                })
            )
          : (
            <Typography variant="sm" className="text-slate-500 text-center py-5">
              <Trans>Your transactions will appear here</Trans>
            </Typography>
            )}
      </div>
    </div>
  )
}
