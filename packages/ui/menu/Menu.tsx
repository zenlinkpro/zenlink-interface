import type { FC, FunctionComponent, JSX } from 'react'
import type { MenuButtonProps } from './MenuButton'
import type { MenuItemProps } from './MenuItem'
import type { MenuItemsProps } from './MenuItems'
import { Menu as HeadlessMenu } from '@headlessui/react'

import classNames from 'classnames'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppearOnMount } from '../animation'
import { MenuButton } from './MenuButton'
import { MenuItem } from './MenuItem'
import { MenuItems } from './MenuItems'
import { usePopper } from './usePopper'

interface MenuProps {
  className?: string
  button: JSX.Element
  children: JSX.Element
  appearOnMount?: boolean
}

const MenuRoot: FC<MenuProps> = ({ className, button, appearOnMount = false, children }) => {
  const [trigger, container] = usePopper({
    placement: 'bottom-end',
    modifiers: [
      { name: 'flip', enabled: true, options: { padding: 8 } },
      { name: 'offset', options: { offset: [0, 10] } },
    ],
  })

  return (
    <AppearOnMount enabled={appearOnMount}>
      {mounted =>
        mounted
          ? (
              <HeadlessMenu as="div" className={classNames(className, 'relative')}>
                {React.cloneElement(button, { ref: trigger })}
                {ReactDOM.createPortal(React.cloneElement(children, { ref: container }), document.body)}
              </HeadlessMenu>
            )
          : (
              <HeadlessMenu as="div" className={classNames(className, 'relative')}>
                {React.cloneElement(button, { ref: trigger })}
                {React.cloneElement(children, { ref: container })}
              </HeadlessMenu>
            )}
    </AppearOnMount>
  )
}

export const Menu: FunctionComponent<MenuProps> & {
  Item: FC<MenuItemProps>
  Items: FC<MenuItemsProps>
  Button: FC<MenuButtonProps>
} = Object.assign(MenuRoot, {
  Item: MenuItem,
  Items: MenuItems,
  Button: MenuButton,
})
