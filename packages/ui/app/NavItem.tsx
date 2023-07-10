import type { FC } from 'react'

import { Link, classNames } from '..'

export interface NavItemProps {
  href: string
  label: string
  external?: boolean
}

export const NavItem: FC<NavItemProps> = ({ href, label, external }) => {
  if (external) {
    return (
      <Link.External href={href} className="decoration-transparent">
        <span
          className={classNames(
            'py-2 px-3.5 hover:bg-slate-300/20 dark:hover:bg-slate-500/20 rounded-xl',
            'font-semibold text-slate-600 dark:text-slate-300 cursor-pointer',
          )}
        >
          {label}
        </span>
      </Link.External>
    )
  }

  return (
    <Link.Internal href={href} className="decoration-transparent" passHref>
      <div>
        <span
          className={classNames(
            'py-2 px-3.5 hover:bg-slate-300/20 dark:hover:bg-slate-500/20 rounded-xl',
            'font-semibold text-slate-600 dark:text-slate-300 cursor-pointer',
          )}
        >
          {label}
        </span>
      </div>
    </Link.Internal>
  )
}
