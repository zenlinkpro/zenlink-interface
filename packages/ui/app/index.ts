import { Header, type HeaderProps } from './Header'
import { Main, type MainProps } from './Main'
import { Nav, type NavProps } from './Nav'
import { Footer } from './Footer'
import { NavItem, type NavItemProps } from './NavItem'
import { NavItemList, type NavItemListProps } from './NavItemList'
import { Shell, type ShellProps } from './Shell'

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
