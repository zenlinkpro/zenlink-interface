import type { ButtonProps } from '@zenlink-interface/ui'
import type { ReactNode } from 'react'
import type { Connector } from 'wagmi'
import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import {
  AppearOnMount,
  CoinbaseWalletIcon,
  GnosisSafeIcon,
  ImTokenIcon,
  LedgerIcon,
  Menu,
  MetamaskIcon,
  NovaWalletIcon,
  OKXWalletIcon,
  PhantomIcon,
  SubwalletIcon,
  TalismanIcon,
  Button as UIButton,
  WalletConnectIcon,
} from '@zenlink-interface/ui'
import React, { useCallback, useMemo } from 'react'
import { useAccount, useConnect } from 'wagmi'

declare global {
  interface Window {
    ethereum?: any
  }
}

const Icons: Record<string, ReactNode> = {
  'Injected': <ChevronDoubleDownIcon height={16} width={16} />,
  'MetaMask': <MetamaskIcon height={16} width={16} />,
  'Talisman': <TalismanIcon height={16} width={16} />,
  'SubWallet': <SubwalletIcon height={16} width={16} />,
  'WalletConnect': <WalletConnectIcon height={16} width={16} />,
  'Coinbase Wallet': <CoinbaseWalletIcon height={16} width={16} />,
  'Gnosis Safe': <GnosisSafeIcon height={16} width={16} />,
  'Ledger': <LedgerIcon height={16} width={16} />,
  'ImToken': <ImTokenIcon height={16} width={16} />,
  'Nova Wallet': <NovaWalletIcon height={16} width={16} />,
  'OKX Wallet': <OKXWalletIcon height={16} width={16} />,
  'Phantom': <PhantomIcon height={16} width={16} />,
}

export type Props<C extends React.ElementType> = ButtonProps<C> & {
  // TODO ramin: remove param when wagmi adds onConnecting callback to useAccount
  hack?: ReturnType<typeof useConnect>
  appearOnMount?: boolean
}

function getInjectedName(connector: Connector): string {
  if (typeof window !== 'undefined') {
    if (window.ethereum?.isNovaWallet)
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

export function Button<C extends React.ElementType>({
  children,
  appearOnMount = true,
  ...rest
}: Props<C>) {
  const { connectors, connect } = useConnect()
  const { address } = useAccount()
  const _connectors = useMemo(() => {
    const conns = [...connectors]
    const injected = conns.find(el => el.id === 'injected')
    const metamask = conns.find(el => el.name === 'MetaMask')

    if (injected && metamask) {
      return [
        metamask,
        ...conns.filter(el => el.id !== 'injected' && el.name !== metamask.name),
      ]
    }
    if (injected)
      return [injected, ...conns.filter(el => el.id !== 'injected' && el.name !== injected.name)]

    return conns
  }, [connectors])

  const _onSelect = useCallback(
    (connectorId: string) => {
      const connector = _connectors.find(el => el.id === connectorId)
      if (!connector)
        return
      setTimeout(() => connect({ connector }), 250)
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
              button={(
                <Menu.Button {...rest} as="div">
                  {children || 'Connect Wallet'}
                </Menu.Button>
              )}
              className={rest.fullWidth ? 'w-full' : ''}
            >
              <Menu.Items className="z-[1090]">
                <div>
                  {isMounted
                    && _connectors.map(connector => (
                      <Menu.Item
                        className="flex items-center gap-3 group"
                        key={connector.id}
                        onClick={() => _onSelect(connector.id)}
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
