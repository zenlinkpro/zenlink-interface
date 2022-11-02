import type { FC, ReactElement } from 'react'

interface BadgeProps {
  badgeContent: ReactElement
  children: ReactElement
}

export const Badge: FC<BadgeProps> = ({ badgeContent, children }) => {
  return (
    <div className="relative">
      <div className="absolute -right-[25%] -top-[15%] z-10">{badgeContent}</div>
      {children}
    </div>
  )
}
