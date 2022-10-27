import type { FC, HTMLProps } from 'react'

import { Box } from './Box'
import type { CircleProps } from './Circle'
import { Circle } from './Circle'

export const Skeleton: { Box: FC<HTMLProps<HTMLDivElement>>; Circle: FC<CircleProps> } = {
  Box,
  Circle,
}
