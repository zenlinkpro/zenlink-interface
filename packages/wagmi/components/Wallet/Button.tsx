import { ArrowRightOnRectangleIcon, ChevronDoubleDownIcon } from '@heroicons/react/24/outline'
import type { ParachainId } from '@zenlink-interface/chain'
import { shortenAddress } from '@zenlink-interface/format'
import type { ButtonProps } from '@zenlink-interface/ui'
import {
  AppearOnMount,
  Loader,
  Menu,
  MetamaskIcon,
  Typography,
  Button as UIButton,
  classNames,
} from '@zenlink-interface/ui'
import type { ReactNode } from 'react'
import React from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

import { useAutoConnect, useWalletState } from '../../hooks'
import { Account } from '../Account'

const Icons: Record<string, ReactNode> = {
  Injected: <ChevronDoubleDownIcon width={16} height={16} />,
  MetaMask: <MetamaskIcon width={16} height={16} />,
}

export type Props<C extends React.ElementType> = ButtonProps<C> & {
  // TODO ramin: remove param when wagmi adds onConnecting callback to useAccount
  hack?: ReturnType<typeof useConnect>
  supportedNetworks?: ParachainId[]
  appearOnMount?: boolean
}

export const Button = <C extends React.ElementType>({
  children,
  supportedNetworks,
  appearOnMount = true,
  ...rest
}: Props<C>) => {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  // TODO ramin: remove param when wagmi adds onConnecting callback to useAccount
  const { connectors, connect, pendingConnector } = useConnect()

  const { pendingConnection, reconnecting, isConnected, connecting } = useWalletState(!!pendingConnector)

  useAutoConnect()

  if (connecting && appearOnMount)
    return <></>

  return (
    <AppearOnMount enabled={appearOnMount}>
      {(isMounted) => {
        // Pending confirmation state
        // Awaiting wallet confirmation
        if (pendingConnection) {
          return (
            <UIButton endIcon={<Loader />} variant="filled" color="blue" disabled {...rest}>
              Authorize Wallet
            </UIButton>
          )
        }

        // Disconnected state
        // We are mounted on the client, but we're not connected, and we're not reconnecting (address is not available)
        if (!isConnected && !reconnecting && isMounted) {
          return (
            <Menu
              className={rest.fullWidth ? 'w-full' : ''}
              button={
                <Menu.Button {...rest} as="div">
                  {children || 'Connect Wallet'}
                </Menu.Button>
              }
            >
              <Menu.Items className="z-[100]">
                <div>
                  {isMounted
                    && connectors.map(connector => (
                      <Menu.Item
                        key={connector.id}
                        onClick={() => connect({ connector })}
                        className="flex items-center gap-3 group"
                      >
                        <div className="-ml-[6px] group-hover:bg-blue-100 rounded-full group-hover:ring-[5px] group-hover:ring-blue-100">
                          {Icons[connector.name] && Icons[connector.name]}
                        </div>{' '}
                        {connector.name}
                      </Menu.Item>
                    ))}
                </div>
              </Menu.Items>
            </Menu>
          )
        }

        // Connected state
        // Show account name and balance if no children provided to button
        if (isMounted && !children) {
          return (
            <Account.AddressToEnsResolver address={address}>
              {({ data: ens }) => (
                <Account.Balance supportedNetworks={supportedNetworks} address={address}>
                  {({ content }) => (
                    <div
                      className={classNames(
                        'z-10 flex items-center border-[3px] border-slate-900 bg-slate-800 rounded-xl',
                        rest.className,
                      )}
                    >
                      <div className="px-3">{content}</div>
                      <Menu
                        className="right-0"
                        button={
                          <Menu.Button color="gray" className="!h-[36px] !px-3 !rounded-xl flex gap-3">
                            <Typography variant="sm" weight={500} className="tracking-wide text-slate-50">
                              {ens || (address ? shortenAddress(address) : '')}
                            </Typography>
                          </Menu.Button>
                        }
                      >
                        <Menu.Items>
                          <div>
                            <Menu.Item
                              className="flex items-center gap-3 group justify-between !pr-4"
                              onClick={() => disconnect()}
                            >
                              Disconnect
                              <ArrowRightOnRectangleIcon height={16} />
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Menu>
                    </div>
                  )}
                </Account.Balance>
              )}
            </Account.AddressToEnsResolver>
          )
        }

        return <UIButton {...rest}>{children || 'Connect Wallet'}</UIButton>
      }}
    </AppearOnMount>
  )
}
