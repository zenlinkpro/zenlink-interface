import type { HeaderProps } from './Header'
import type { MainProps } from './Main'
import type { NavProps } from './Nav'
import type { NavItemProps } from './NavItem'
import type { NavItemListProps } from './NavItemList'
import type { ShellProps } from './Shell'
import { Footer } from './Footer'
import { Header } from './Header'
import { Main } from './Main'
import { Nav } from './Nav'
import { NavItem } from './NavItem'
import { NavItemList } from './NavItemList'
import { Shell } from './Shell'

export interface AppProps {
  Header: HeaderProps
  Shell: ShellProps
  Nav: NavProps
  Main: MainProps
  NavItem: NavItemProps
  NavItemList: NavItemListProps
}

export const App = {
  Header,
  Shell,
  Nav,
  NavItem,
  NavItemList,
  Footer,
  Main,
}

export { AppType } from './Header'
