import type { ParachainId } from '@zenlink-interface/chain'
import type { Connector } from '@zenlink-interface/polkadot'
import { connectors } from '@zenlink-interface/polkadot'
import type { ButtonProps } from '@zenlink-interface/ui'
import {
  AppearOnMount,
  Menu,
  PolkadotwalletIcon,
  SubwalletIcon,
  TalismanIcon,
  Button as UIButton,
} from '@zenlink-interface/ui'
import type { ReactNode } from 'react'

const Icons: Record<string, ReactNode> = {
  'Polkadot-js': <PolkadotwalletIcon width={16} height={16} />,
  'Subwallet': <SubwalletIcon width={16} height={16} />,
  'Talisman': <TalismanIcon width={16} height={16} />,
}

export type Props<C extends React.ElementType> = ButtonProps<C> & {
  supportedNetworks?: ParachainId[]
  appearOnMount?: boolean
  setConnector(connector: Connector): void
}

export const Button = <C extends React.ElementType>({
  children,
  appearOnMount = true,
  setConnector,
  ...rest
}: Props<C>) => {
  return (
    <AppearOnMount enabled={appearOnMount}>
      {(isMounted) => {
        if (isMounted) {
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
                        onClick={() => setConnector(connector)}
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

        return <UIButton {...rest}>{children || 'Connect Wallet'}</UIButton>
      }}
    </AppearOnMount>
  )
}
