import { Popover } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ParachainId, chainsChainIdToParachainId } from '@zenlink-interface/chain'
import { shortenAddress } from '@zenlink-interface/format'
import { useIsMounted } from '@zenlink-interface/hooks'
import { DEFAULT_INPUT_UNSTYLED, JazzIcon, classNames, useBreakpoint } from '@zenlink-interface/ui'
import Image from 'next/legacy/image'
import type { FC } from 'react'
import { useState } from 'react'
import ReactDOM from 'react-dom'
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'

import { Wallet } from '..'
import { Default } from './Default'
import { Transactions } from './Transactions'

export enum ProfileView {
  Default,
  Transactions,
}

interface ProfileProps {
  supportedNetworks: ParachainId[]
  notifications: Record<number, string[]>
  clearNotifications(): void
}

export const Profile: FC<ProfileProps> = ({ notifications, clearNotifications }) => {
  const { isSm } = useBreakpoint('sm')
  const [view, setView] = useState<ProfileView>(ProfileView.Default)
  const { address, chain } = useAccount()
  const mounted = useIsMounted()
  const chainId = chainsChainIdToParachainId[chain?.id ?? -1] || ParachainId.ASTAR

  const { data: ensName } = useEnsName({ address, chainId: 1 })
  const { data: avatar } = useEnsAvatar({
    name: ensName ?? undefined,
    chainId: 1,
  })

  if (!address || !mounted) {
    return (
      <Wallet.Button
        className="border-none shadow-md whitespace-nowrap"
        size="sm"
      />
    )
  }

  if (address) {
    const panel = (
      <Popover.Panel className="w-full sm:w-[320px] fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] mt-4 sm:rounded-xl rounded-b-none shadow-dropdown bg-white dark:bg-slate-800 border border-slate-200/20">
        {view === ProfileView.Default && <Default address={address} chainId={chainId} setView={setView} />}
        {view === ProfileView.Transactions && (
          <Transactions clearNotifications={clearNotifications} notifications={notifications} setView={setView} />
        )}
      </Popover.Panel>
    )

    return (
      <Popover className="relative">
        {({ open }) => {
          return (
            <>
              <Popover.Button
                className={classNames(
                  DEFAULT_INPUT_UNSTYLED,
                  'flex items-center gap-1 md:gap-2 !bg-black/[0.04] dark:!bg-white/[0.04] hover:!bg-black/[0.08] hover:!dark:bg-white/[0.08] hover:text-black hover:dark:text-white h-[38px] rounded-xl px-2 !font-semibold !text-sm text-slate-800 dark:text-slate-200',
                )}
              >
                {avatar
                  ? (
                    <Image alt="ens-avatar" className="rounded-full" height={20} src={avatar} width={20} />
                    )
                  : (
                    <JazzIcon address={address} diameter={20} />
                    )}
                {isSm ? shortenAddress(address) : ''}
                <ChevronDownIcon
                  className={classNames(open ? 'rotate-180' : 'rotate-0', 'transition-transform')}
                  height={20}
                  width={20}
                />
              </Popover.Button>
              {!isSm ? ReactDOM.createPortal(panel, document.body) : panel}
            </>
          )
        }}
      </Popover>
    )
  }

  return <span />
}
