import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid'
import type { FC } from 'react'

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
          <HomeIcon width={16} className="cursor-pointer group-hover:text-slate-50 text-slate-600" />
        </div>
      </Link.Internal>
      {links
        .map((link, index) => {
          const last = links.length === index + 1
          if (last) {
            return (
              <Typography key={`index-${link.label}`} variant="sm" weight={500} className="text-slate-300">
                {link.label}
              </Typography>
            )
          }

          return (
            <Link.Internal href={link.href} passHref={true} key={`index-${link.label}`}>
              <div className="flex items-center gap-2 group">
                <Typography
                  variant="sm"
                  weight={500}
                  className="cursor-pointer group-hover:text-slate-50 text-slate-600"
                >
                  {link.label}
                </Typography>
              </div>
            </Link.Internal>
          )
        })
        .reduce<JSX.Element[]>(
          (prev, cur, index) => [...prev, <ChevronRightIcon width={24} className="text-slate-600" key={index} />, cur],
          [],
        )}
    </div>
  )
}
