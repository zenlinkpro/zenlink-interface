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
            'font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer',
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
            'font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer',
          )}
        >
          {label}
        </span>
      </div>
    </Link.Internal>
  )
}
