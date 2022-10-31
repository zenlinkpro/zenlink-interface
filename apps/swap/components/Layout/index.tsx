import type { BreadcrumbLink, MaxWidth } from '@zenlink-interface/ui'
import { Backdrop, Breadcrumb, Container, classNames } from '@zenlink-interface/ui'
import React from 'react'

interface Props {
  children?: React.ReactNode
  maxWidth?: MaxWidth
  backdrop?: React.ReactNode
  className?: string
  breadcrumbs?: BreadcrumbLink[]
}

export function Layout({ children, maxWidth = '5xl', backdrop, className, breadcrumbs }: Props) {
  return (
    <Container maxWidth={maxWidth} className={classNames(className, 'lg:mx-auto px-4 h-full')}>
      {breadcrumbs && <Breadcrumb home="/" links={breadcrumbs} />}
      <div className="pb-4 mb-4 lg:mb-40 lg:mt-20 mt-10">
        <Backdrop backdrop={backdrop}>{children}</Backdrop>
      </div>
    </Container>
  )
}
