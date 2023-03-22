import type { FC, HTMLProps } from 'react'

import { Box } from './Box'
import type { CircleProps } from './Circle'
import { Circle } from './Circle'
import { Text } from './Text'
import type { TextProps } from './Text'

export const Skeleton: {
  Box: FC<HTMLProps<HTMLDivElement>>
  Circle: FC<CircleProps>
  Text: FC<TextProps>
} = {
  Box,
  Circle,
  Text,
}
