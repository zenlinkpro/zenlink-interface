import type { FC } from 'react'

import type { SelectorProps } from './Selector'
import { Selector } from './Selector'
import type { SelectorMenuProps } from './SelectorMenu'
import { SelectorMenu } from './SelectorMenu'

interface NetworkProps {
  Selector: FC<SelectorProps>
  SelectorMenu: FC<SelectorMenuProps>
}

export const Network: NetworkProps = {
  Selector,
  SelectorMenu,
}
