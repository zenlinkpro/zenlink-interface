import type { FC } from 'react'
import React from 'react'

const Head: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>> = ({
  children,
  ...props
}) => {
  return (
    <thead {...props} className="bg-white dark:bg-slate-800 border-b border-slate-500/20">
      {children}
    </thead>
  )
}

export default Head
