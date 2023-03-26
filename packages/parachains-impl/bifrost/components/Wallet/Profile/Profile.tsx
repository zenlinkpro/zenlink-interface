import { Popover } from '@headlessui/react'
import type { ParachainId } from '@zenlink-interface/chain'
import { useAccount } from '@zenlink-interface/polkadot'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { DEFAULT_INPUT_UNSTYLED, JazzIcon, classNames, useBreakpoint } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import { useSettings } from '@zenlink-interface/shared'
import { shortenName } from '@zenlink-interface/format'
import { Default, Transactions, Wallet } from '..'

export enum ProfileView {
  Default,
  Transactions,
}

interface ProfileProps {
  parachainId: ParachainId
  supportedNetworks: ParachainId[]
  notifications: Record<number, string[]>
  clearNotifications(): void
}

export const Profile: FC<ProfileProps> = ({
  notifications,
  clearNotifications,
  parachainId,
}) => {
  const { isSm } = useBreakpoint('sm')
  const [view, setView] = useState<ProfileView>(ProfileView.Default)
  const [{ polkadotConnector }, { updatePolkadotConnector, updatePolkadotAddress }] = useSettings()
  const { account, allAccounts } = useAccount()

  const disconnect = useCallback(() => {
    updatePolkadotAddress(undefined)
    updatePolkadotConnector(undefined)
  }, [updatePolkadotAddress, updatePolkadotConnector])

  if (!polkadotConnector || !account) {
    return (
      <Wallet.Button
        size="sm"
        loading={!!polkadotConnector}
        className="border-none shadow-md whitespace-nowrap"
      />
    )
  }

  if (account) {
    const panel = (
      <Popover.Panel className="w-full sm:w-[320px] fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] mt-4 sm:rounded-xl rounded-b-none shadow-sm shadow-black/[0.3] bg-white dark:bg-slate-800 border border-slate-200/20">
        {view === ProfileView.Default && (
          <Default
            disconnect={disconnect}
            chainId={parachainId}
            account={account}
            setView={setView}
            updatePolkadotAddress={updatePolkadotAddress}
            allAccounts={allAccounts}
          />
        )}
        {view === ProfileView.Transactions && (
          <Transactions setView={setView} notifications={notifications} clearNotifications={clearNotifications} />
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
                <JazzIcon diameter={20} address={account.address} />
                {isSm ? account.name && shortenName(account.name, 8) : ''}
                <ChevronDownIcon
                  width={20}
                  height={20}
                  className={classNames(open ? 'rotate-180' : 'rotate-0', 'transition-transform')}
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
