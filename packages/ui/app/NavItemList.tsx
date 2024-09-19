import type { FC, ReactElement } from 'react'

import type { NavItem } from './NavItem'
import { classNames } from '../index'

export interface NavItemListProps {
  className?: string
  children: ReactElement<typeof NavItem> | Array<ReactElement<typeof NavItem>>
  hideOnMobile?: boolean
}

export const NavItemList: FC<NavItemListProps> = ({ children, className, hideOnMobile = true }) => {
  return <div className={classNames(className, hideOnMobile ? 'hidden lg:flex' : 'flex', 'gap-4')}>{children}</div>
}
