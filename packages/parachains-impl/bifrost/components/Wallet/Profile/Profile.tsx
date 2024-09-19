import type { ParachainId } from '@zenlink-interface/chain'
import type { FC } from 'react'
import { Popover } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { shortenAddress, shortenName } from '@zenlink-interface/format'
import { useAccount, useProviderAccounts } from '@zenlink-interface/polkadot'
import { useSettings } from '@zenlink-interface/shared'
import { classNames, DEFAULT_INPUT_UNSTYLED, JazzIcon, useBreakpoint } from '@zenlink-interface/ui'
import { useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import { Default, Transactions, Wallet } from '..'

export enum ProfileView {
  Default,
  Transactions,
}

interface ProfileProps {
  parachainId: ParachainId
  supportedNetworks: ParachainId[]
  notifications: Record<number, string[]>
  clearNotifications: () => void
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
  const { setAccounts, setWallet, wallet } = useProviderAccounts()

  const disconnect = useCallback(async () => {
    await wallet?.disconnect()
    updatePolkadotAddress(undefined)
    updatePolkadotConnector(undefined)
    setWallet(undefined)
    setAccounts([])
  }, [setAccounts, setWallet, updatePolkadotAddress, updatePolkadotConnector, wallet])

  if (!polkadotConnector || !account) {
    return (
      <Wallet.Button
        className="border-none shadow-md whitespace-nowrap"
        loading={!!polkadotConnector}
        size="sm"
      />
    )
  }

  if (account) {
    const panel = (
      <Popover.Panel className="w-full sm:w-[320px] fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] mt-4 sm:rounded-xl rounded-b-none shadow-dropdown bg-white dark:bg-slate-800 border border-slate-200/20">
        {view === ProfileView.Default && (
          <Default
            account={account}
            allAccounts={allAccounts}
            chainId={parachainId}
            disconnect={disconnect}
            setView={setView}
            updatePolkadotAddress={updatePolkadotAddress}
          />
        )}
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
                <JazzIcon address={account.address} diameter={20} />
                {isSm
                  ? account.name
                    ? shortenName(account.name, 8)
                    : shortenAddress(account.address, 2)
                  : ''}
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
