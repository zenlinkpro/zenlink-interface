import type { FC, HTMLProps } from 'react'

import type { CircleProps } from './Circle'
import type { TextProps } from './Text'
import { Box } from './Box'
import { Circle } from './Circle'
import { Text } from './Text'

export const Skeleton: {
  Box: FC<HTMLProps<HTMLDivElement>>
  Circle: FC<CircleProps>
  Text: FC<TextProps>
} = {
  Box,
  Circle,
  Text,
}
