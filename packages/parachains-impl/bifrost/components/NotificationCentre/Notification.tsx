import { Disclosure } from '@headlessui/react'
import {
  ArrowDownTrayIcon,
  ArrowRightIcon,
  ArrowUpTrayIcon,
  ArrowsUpDownIcon,
  FireIcon,
  LockOpenIcon,
  PlusIcon,
  UserPlusIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import chains, { ParachainId, chainsChainIdToParachainId } from '@zenlink-interface/chain'
import type { NotificationData } from '@zenlink-interface/ui'
import {
  Badge,
  Dots,
  IconButton,
  Link,
  Loader,
  NetworkIcon,
  TimeAgo,
  Typography,
  classNames,
} from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useWaitForTransaction } from '@zenlink-interface/polkadot'

export const Notification: FC<{ data: string; showExtra?: boolean; hideStatus?: boolean }> = ({
  data,
  showExtra = false,
  hideStatus = false,
}) => {
  const notification: NotificationData = JSON.parse(data)
  const { status } = useWaitForTransaction(notification.chainId, notification.txHash)

  if (!status) {
    return (
      <div className="flex items-center gap-5 px-4 pr-8 bg-black/[0.06] dark:bg-white/[0.06] rounded-2xl min-h-[82px] w-full">
        <div>
          <div className="rounded-full bg-slate-400 dark:bg-slate-600 h-9 w-9" />
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-col gap-1 w-full">
            <div className="bg-slate-500 w-full h-[12px] animate-pulse rounded-full" />
            <div className="bg-slate-500 w-[60px] h-[12px] animate-pulse rounded-full" />
          </div>
          <div className="bg-slate-600 w-[120px] h-[10px] animate-pulse rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative hover:opacity-80">
      {showExtra && (
        <Disclosure.Button className="absolute right-3 top-0 bottom-0 z-[100]">
          {({ open }) => {
            return (
              <IconButton as="div">
                <ChevronDownIcon
                  width={20}
                  height={20}
                  className={classNames(open ? 'rotate-180' : 'rotate-0', 'rounded-full transition-all delay-200')}
                />
              </IconButton>
            )
          }}
        </Disclosure.Button>
      )}
      <Link.External
        href={
          notification.href
            ? notification.href
            : chains[
              notification.chainId in ParachainId
                ? notification.chainId
                : chainsChainIdToParachainId[notification.chainId]
            ].getTxUrl(notification.txHash)
        }
        className="!no-underline"
      >
        <div
          className={classNames(
            showExtra ? 'pr-10' : 'pr-4',
            'relative cursor-pointer flex items-center gap-5 rounded-2xl px-4 py-3',
          )}
        >
          <Badge badgeContent={<NetworkIcon chainId={notification.chainId} width={18} height={18} />}>
            <div className="p-2 bg-slate-200 dark:bg-slate-600 rounded-full h-[36px] w-[36px] flex justify-center items-center">
              {!hideStatus
                && (status === 'loading'
                  ? <Loader size={18} />
                  : status === 'error'
                    ? <XMarkIcon width={20} height={20} className="text-red-400" />
                    : <></>
                )}
              {(status === 'success' || notification.summary.info) && notification.type === 'send' && (
                <ArrowRightIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'swap' && (
                <ArrowsUpDownIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'approval' && (
                <LockOpenIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'mint' && (
                <PlusIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'burn' && (
                <FireIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'enterBar' && (
                <ArrowDownTrayIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'leaveBar' && (
                <ArrowUpTrayIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'generateCode' && (
                <UserPlusIcon width={20} height={20} />
              )}
              {(status === 'success' || notification.summary.info) && notification.type === 'setCode' && (
                <UsersIcon width={20} height={20} />
              )}
            </div>
          </Badge>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <Typography as="span" variant="sm" weight={500} className="items-center text-slate-900 dark:text-slate-50 whitespace-normal">
                {notification.summary.info
                  ? (
                      notification.summary.info
                    )
                  : ['loading'].includes(status)
                      ? (
                      <Dots>{notification.summary.pending}</Dots>
                        )
                      : status === 'error'
                        ? (
                            notification.summary.failed
                          )
                        : (
                            notification.summary.completed
                          )}
              </Typography>
            </div>
            <Typography variant="xs" className="text-slate-500">
              <TimeAgo date={new Date(notification.timestamp)} />
            </Typography>
          </div>
        </div>
      </Link.External>
    </div>
  )
}
