import type { ButtonProps } from '@zenlink-interface/ui'
import type { ReactNode } from 'react'
import { t } from '@lingui/macro'
import { connectors, ConnectorSource, useProviderAccounts, useWallets } from '@zenlink-interface/polkadot'
import { useSettings } from '@zenlink-interface/shared'
import {
  AppearOnMount,
  Menu,
  PolkadotwalletIcon,
  SubwalletIcon,
  TalismanIcon,
  Button as UIButton,
  WalletConnectIcon,
} from '@zenlink-interface/ui'
import { useCallback, useEffect, useState } from 'react'

const Icons: Record<string, ReactNode> = {
  'Polkadot-js': <PolkadotwalletIcon height={16} width={16} />,
  'Subwallet': <SubwalletIcon height={16} width={16} />,
  'Talisman': <TalismanIcon height={16} width={16} />,
  'WalletConnect': <WalletConnectIcon height={16} width={16} />,
}

export type Props<C extends React.ElementType> = ButtonProps<C> & {
  appearOnMount?: boolean
}

export function Button<C extends React.ElementType>({
  children,
  appearOnMount = true,
  ...rest
}: Props<C>) {
  const [{ polkadotConnector }, { updatePolkadotConnector }] = useSettings()
  const { wallets } = useWallets()
  const { accounts, setAccounts, setWallet } = useProviderAccounts()
  const [isBusy, setIsBusy] = useState<boolean>(false)

  const selectConnector = useCallback(async (connectorId: string) => {
    if (!wallets?.length)
      return
    const wallet = wallets.find(({ metadata: { id } }) => id === connectorId)
    if (!wallet)
      return

    if (!isBusy) {
      try {
        setIsBusy(true)
        updatePolkadotConnector(connectorId)
        await wallet.connect()
        const accounts = await wallet.getAccounts()
        setWallet(wallet)
        setAccounts(
          Array.from(
            new Set(accounts.map(a => JSON.stringify(a))),
          ).map(a => JSON.parse(a)),
        )
      }
      catch (error) {
        // handle error
      }
      finally {
        setIsBusy(false)
      }
    }
  }, [isBusy, setAccounts, setWallet, updatePolkadotConnector, wallets])

  useEffect(() => {
    if (polkadotConnector && !accounts.length) {
      if (polkadotConnector === ConnectorSource.WalletConnect)
        updatePolkadotConnector(undefined)
      else
        selectConnector(polkadotConnector)
    }
  }, [accounts.length, polkadotConnector, selectConnector, updatePolkadotConnector])

  return (
    <AppearOnMount enabled={appearOnMount}>
      {(isMounted) => {
        if (isMounted) {
          return (
            <Menu
              button={(
                <Menu.Button {...rest} as="div">
                  {children || t`Connect Wallet`}
                </Menu.Button>
              )}
              className={rest.fullWidth ? 'w-full' : ''}
            >
              <Menu.Items className="z-[100]">
                <div>
                  {isMounted
                  && connectors.map(connector => (
                    <Menu.Item
                      className="flex items-center gap-3 group"
                      key={connector.id}
                      onClick={() => selectConnector(connector.id)}
                    >
                      <div className="-ml-[6px] group-hover:bg-blue-100 rounded-full group-hover:ring-[5px] group-hover:ring-blue-100">
                        {Icons[connector.name] && Icons[connector.name]}
                      </div>
                      {' '}
                      {connector.name}
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
