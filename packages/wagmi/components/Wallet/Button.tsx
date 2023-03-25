import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline'
import type { ButtonProps } from '@zenlink-interface/ui'
import {
  AppearOnMount,
  CoinbaseWalletIcon,
  GnosisSafeIcon,
  LedgerIcon,
  Loader,
  Menu,
  MetamaskIcon,
  SubwalletIcon,
  TalismanIcon,
  Button as UIButton,
  WalletConnectIcon,
} from '@zenlink-interface/ui'
import type { ReactNode } from 'react'
import React from 'react'
import { useConnect } from 'wagmi'

import { useAutoConnect, useWalletState } from '../../hooks'

const Icons: Record<string, ReactNode> = {
  'Injected': <ChevronDoubleDownIcon width={16} height={16} />,
  'MetaMask': <MetamaskIcon width={16} height={16} />,
  'Talisman': <TalismanIcon width={16} height={16} />,
  'SubWallet': <SubwalletIcon width={16} height={16} />,
  'WalletConnect': <WalletConnectIcon width={16} height={16} />,
  'Coinbase Wallet': <CoinbaseWalletIcon width={16} height={16} />,
  'Safe': <GnosisSafeIcon width={16} height={16} />,
  'Ledger': <LedgerIcon width={16} height={16} />,
}

export type Props<C extends React.ElementType> = ButtonProps<C> & {
  // TODO ramin: remove param when wagmi adds onConnecting callback to useAccount
  hack?: ReturnType<typeof useConnect>
  appearOnMount?: boolean
}

export const Button = <C extends React.ElementType>({
  children,
  appearOnMount = true,
  ...rest
}: Props<C>) => {
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
                        {connector.name === 'Safe' ? 'Gnosis Safe' : connector.name}
                      </Menu.Item>
                    ))}
                </div>
              </Menu.Items>
            </Menu>
          )
        }

        return <UIButton {...rest}>{children || 'Connect Wallet'}</UIButton>
      }}
    </AppearOnMount>
  )
}
