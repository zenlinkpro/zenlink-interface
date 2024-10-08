import type { FC } from 'react'
import { Disclosure } from '@headlessui/react'

import { Notification } from './Notification'

interface NotificationGroupProps {
  notifications: string[]
}

export const NotificationGroup: FC<NotificationGroupProps> = ({ notifications }) => {
  return (
    <Disclosure>
      {({ open }) => {
        return (
          <div className="relative bg-black/[0.06] dark:bg-white/[0.06] rounded-xl">
            {notifications.length > 1 && open && (
              <div className="absolute left-[33px] top-7 bottom-7 w-0.5 bg-gradient-to-b from-slate-700 to-blue" />
            )}
            <Notification data={notifications[0]} showExtra={notifications.length > 1} />
            {notifications.length > 1 && (
              <Disclosure.Panel>
                {notifications.map((el, idx) => {
                  if (idx > 0)
                    return <Notification data={el} hideStatus key={idx} />
                  return <></>
                })}
              </Disclosure.Panel>
            )}
          </div>
        )
      }}
    </Disclosure>
  )
}
