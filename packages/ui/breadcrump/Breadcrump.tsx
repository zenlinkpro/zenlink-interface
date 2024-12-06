import type { FC, JSX } from 'react'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid'

import { Link, Typography } from '..'

export interface BreadcrumbLink {
  href: string
  label: string
}

interface BreadcrumbProps {
  home: string
  links: BreadcrumbLink[]
}

export const Breadcrumb: FC<BreadcrumbProps> = ({ links, home }) => {
  return (
    <div className="flex items-center gap-2 mt-4">
      <Link.Internal href={home} passHref={true}>
        <div className="flex items-center gap-2 group">
          <HomeIcon className="cursor-pointer group-hover:text-slate-900 dark:group-hover:text-slate-50 text-slate-400 dark:text-slate-600" width={16} />
        </div>
      </Link.Internal>
      {links
        .map((link, index) => {
          const last = links.length === index + 1
          if (last) {
            return (
              <Typography className="text-slate-700 dark:text-slate-300" key={`index-${link.label}`} variant="sm" weight={500}>
                {link.label}
              </Typography>
            )
          }

          return (
            <Link.Internal href={link.href} key={`index-${link.label}`} passHref={true}>
              <div className="flex items-center gap-2 group">
                <Typography
                  className="cursor-pointer group-hover:text-slate-900 dark:group-hover:text-slate-50 text-slate-400 dark:text-slate-600"
                  variant="sm"
                  weight={500}
                >
                  {link.label}
                </Typography>
              </div>
            </Link.Internal>
          )
        })
        .reduce<JSX.Element[]>(
          (prev, cur, index) => [...prev, <ChevronRightIcon className="text-slate-400 dark:text-slate-600" key={index} width={24} />, cur],
          [],
        )}
    </div>
  )
}
