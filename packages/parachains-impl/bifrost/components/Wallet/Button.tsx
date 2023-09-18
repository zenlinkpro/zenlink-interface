import { t } from '@lingui/macro'
import { useWallets } from '@polkadot-onboard/react'
import { connectors, useProviderAccounts } from '@zenlink-interface/polkadot'
import { useSettings } from '@zenlink-interface/shared'
import type { ButtonProps } from '@zenlink-interface/ui'
import {
  AppearOnMount,
  Menu,
  PolkadotwalletIcon,
  SubwalletIcon,
  TalismanIcon,
  Button as UIButton,
} from '@zenlink-interface/ui'
import { type ReactNode, useCallback, useEffect, useState } from 'react'

const Icons: Record<string, ReactNode> = {
  'Polkadot-js': <PolkadotwalletIcon width={16} height={16} />,
  'Subwallet': <SubwalletIcon width={16} height={16} />,
  'Talisman': <TalismanIcon width={16} height={16} />,
}

export type Props<C extends React.ElementType> = ButtonProps<C> & {
  appearOnMount?: boolean
}

export const Button = <C extends React.ElementType>({
  children,
  appearOnMount = true,
  ...rest
}: Props<C>) => {
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
        setAccounts(accounts)
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
    if (polkadotConnector && !accounts.length)
      selectConnector(polkadotConnector)
  }, [accounts.length, polkadotConnector, selectConnector])

  return (
    <AppearOnMount enabled={appearOnMount}>
      {(isMounted) => {
        if (isMounted) {
          return (
            <Menu
              className={rest.fullWidth ? 'w-full' : ''}
              button={
                <Menu.Button {...rest} as="div">
                  {children || t`Connect Wallet`}
                </Menu.Button>
              }
            >
              <Menu.Items className="z-[100]">
                <div>
                  {isMounted
                    && connectors.map(connector => (
                      <Menu.Item
                        key={connector.id}
                        onClick={() => selectConnector(connector.id)}
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

        return <UIButton>{children || t`Connect Wallet`}</UIButton>
      }}
    </AppearOnMount>
  )
}
