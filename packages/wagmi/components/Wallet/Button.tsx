import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline'
import type { ButtonProps } from '@zenlink-interface/ui'
import {
  AppearOnMount,
  CoinbaseWalletIcon,
  GnosisSafeIcon,
  ImTokenIcon,
  LedgerIcon,
  Menu,
  MetamaskIcon,
  NovaWalletIcon,
  SubwalletIcon,
  TalismanIcon,
  Button as UIButton,
  WalletConnectIcon,
} from '@zenlink-interface/ui'
import type { ReactNode } from 'react'
import React, { useCallback, useMemo } from 'react'
import type { Connector, WindowProvider } from 'wagmi'
import { useAccount, useConnect } from 'wagmi'
import { t } from '@lingui/macro'

declare global {
  interface Window {
    ethereum?: any
  }
}

const Icons: Record<string, ReactNode> = {
  'Injected': <ChevronDoubleDownIcon width={16} height={16} />,
  'MetaMask': <MetamaskIcon width={16} height={16} />,
  'Talisman': <TalismanIcon width={16} height={16} />,
  'SubWallet': <SubwalletIcon width={16} height={16} />,
  'WalletConnect': <WalletConnectIcon width={16} height={16} />,
  'Coinbase Wallet': <CoinbaseWalletIcon width={16} height={16} />,
  'Gnosis Safe': <GnosisSafeIcon width={16} height={16} />,
  'Ledger': <LedgerIcon width={16} height={16} />,
  'ImToken': <ImTokenIcon width={16} height={16} />,
  'Nova Wallet': <NovaWalletIcon width={16} height={16} />,
}

export type Props<C extends React.ElementType> = ButtonProps<C> & {
  // TODO ramin: remove param when wagmi adds onConnecting callback to useAccount
  hack?: ReturnType<typeof useConnect>
  appearOnMount?: boolean
}

function getInjectedName(connector: Connector): string {
  if (typeof window !== 'undefined') {
    if ((window.ethereum as WindowProvider)?.isNovaWallet)
      return 'Nova Wallet'
    return connector.name
  }
  return connector.name
}

function getConnectorName(connector: Connector): string {
  switch (connector.name) {
    case 'Injected':
      return getInjectedName(connector)
    case 'Safe':
      return 'Gnosis Safe'
    default:
      return connector.name
  }
}

export const Button = <C extends React.ElementType>({
  children,
  appearOnMount = true,
  ...rest
}: Props<C>) => {
  const { connectors, connect } = useConnect()
  const { address } = useAccount()
  const _connectors = useMemo(() => {
    const conns = [...connectors]
    const injected = conns.find(el => el.id === 'injected')

    if (injected)
      return [injected, ...conns.filter(el => el.id !== 'injected' && el.name !== injected.name)]

    return conns
  }, [connectors])

  const _onSelect = useCallback(
    (connectorId: string) => {
      setTimeout(
        () =>
          connect({
            connector: _connectors.find(el => el.id === connectorId),
          }),
        250,
      )
    },
    [connect, _connectors],
  )

  return (
    <AppearOnMount enabled={appearOnMount}>
      {(isMounted) => {
        // Disconnected state
        // We are mounted on the client, but we're not connected, and we're not reconnecting (address is not available)
        if (!address && isMounted) {
          return (
            <Menu
              className={rest.fullWidth ? 'w-full' : ''}
              button={
                <Menu.Button {...rest} as="div">
                  {children || 'Connect Wallet'}
                </Menu.Button>
              }
            >
              <Menu.Items className="z-[1090]">
                <div>
                  {isMounted
                    && _connectors.map(connector => (
                      <Menu.Item
                        key={connector.id}
                        onClick={() => _onSelect(connector.id)}
                        className="flex items-center gap-3 group"
                      >
                        <div className="-ml-[6px] group-hover:bg-blue-100 rounded-full group-hover:ring-[5px] group-hover:ring-blue-100">
                          {Icons[getConnectorName(connector)] && Icons[getConnectorName(connector)]}
                        </div>{' '}
                        {getConnectorName(connector)}
                      </Menu.Item>
                    ))}
                </div>
              </Menu.Items>
            </Menu>
          )
        }

        return <UIButton>{children || t`Connect Wallet`}</UIButton>
      }}
    </AppearOnMount>
  )
}
