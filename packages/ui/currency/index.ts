import type { FC } from 'react'

import type { IconProps } from './Icon'
import type { IconListProps } from './IconList'
import type { ListProps } from './List'
import { Icon } from './Icon'
import { IconList } from './IconList'
import { List } from './List'

interface CurrencyProps {
  List: FC<ListProps>
  Icon: FC<IconProps>
  IconList: FC<IconListProps>
}

export const Currency: CurrencyProps = {
  List,
  Icon,
  IconList,
}
