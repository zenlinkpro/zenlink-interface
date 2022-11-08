import type { FC } from 'react'
import React from 'react'

const Head: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>> = ({
  children,
  ...props
}) => {
  return (
    <thead {...props} className="bg-slate-800">
      {children}
    </thead>
  )
}

export default Head
