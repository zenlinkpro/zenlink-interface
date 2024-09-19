import type { MaxWidth } from '@zenlink-interface/ui'
import { Backdrop, classNames, Container } from '@zenlink-interface/ui'
import React from 'react'

interface Props {
  children?: React.ReactNode
  maxWidth?: MaxWidth
  backdrop?: React.ReactNode
  className?: string
}

export function Layout({ children, maxWidth = '6xl', backdrop, className }: Props) {
  return (
    <Container
      className={classNames(className, 'lg:mx-auto px-4 h-full pb-4 mb-4 lg:mb-40 lg:mt-20 mt-10')}
      maxWidth={maxWidth}
    >
      <Backdrop backdrop={backdrop}>{children}</Backdrop>
    </Container>
  )
}
