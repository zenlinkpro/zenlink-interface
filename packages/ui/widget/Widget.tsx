import type { FC, ReactNode } from 'react'

import type { MaxWidth } from '../index'
import type { WidgetContentProps } from './WidgetContent'
import type { WidgetHeaderProps } from './WidgetHeader'
import { classNames, Container } from '../index'
import { WidgetContent } from './WidgetContent'
import { WidgetHeader } from './WidgetHeader'

interface WidgetRootProps {
  id: string
  className?: string
  children: ReactNode
  maxWidth: MaxWidth | number
}

const WidgetRoot: FC<WidgetRootProps> = ({ id, className, maxWidth, children }) => {
  return (
    <Container
      as="article"
      id={id}
      {...(typeof maxWidth === 'string' && { maxWidth })}
      className={classNames(
        className,
        'flex flex-col mx-auto rounded-2xl border border-slate-500/50 relative overflow-hidden bg-white dark:bg-slate-700',
      )}
      style={{
        ...(typeof maxWidth === 'number' && { maxWidth }),
      }}
    >
      {children}
    </Container>
  )
}

export const Widget: FC<WidgetRootProps> & {
  Header: FC<WidgetHeaderProps>
  Content: FC<WidgetContentProps>
} = Object.assign(WidgetRoot, {
  Header: WidgetHeader,
  Content: WidgetContent,
})
