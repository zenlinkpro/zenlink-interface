import { Trans } from '@lingui/macro'
import { useCallback } from 'react'
import { Container, DiscordIcon, GithubIcon, Link, TwitterIcon, Typography, ZenlinkIcon } from '..'

export type FooterProps = React.HTMLProps<HTMLDivElement>

const config: Record<
  string,
  | Record<string, { href: string; rel?: string; target?: string }>
  | Array<Record<string, Record<string, { href: string; rel?: string; target?: string }>>>
> = {
  Services: {
    Swap: { href: 'https://app.zenlink.pro/swap' },
    Pool: { href: 'https://app.zenlink.pro/pool' },
    Referrals: { href: 'https://app.zenlink.pro/referrals' },
    Analytics: { href: 'https://app.zenlink.pro/analytics' },
  },
  Help: {
    'About Us': {
      href: 'https://zenlink.pro',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    'Blog': {
      href: 'https://medium.com/zenlinkpro',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    'Discord Support': {
      href: 'https://discord.com/invite/v32WcymvXn',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    'Telegram Support': {
      href: 'https://t.me/ZenlinkPro_EN',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    'Twitter Support': {
      href: 'https://twitter.com/ZenlinkPro',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  },
  Developers: {
    'Wiki/Docs': {
      href: 'https://wiki.zenlink.pro/',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    'GitHub': {
      href: 'https://github.com/zenlinkpro',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  },
  Items: [
    {
      Audit: {
        'Audit Report': {
          href: 'https://github.com/zenlinkpro/zenlink-security-audit',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        'Bug Bounty': {
          href: 'https://immunefi.com/bounty/zenlink/',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      },
    },
  ],
}

export function Footer(props: FooterProps): JSX.Element {
  const leafNode = useCallback(
    (title: string, items: Record<string, { href: string; rel?: string; target?: string }>) => {
      return (
        <div key={title} className="flex flex-col gap-[10px]">
          <Typography variant="xs" weight={500} className="text-sm sm:text-xs text-slate-900 dark:text-slate-100">
            {title}
          </Typography>
          {Object.entries(items).map(([item, { href, rel, target }]) => (
            <a
              key={item}
              href={href}
              target={target}
              rel={rel}
              className="text-sm cursor-pointer sm:text-xs text-slate-600 dark:text-slate-400 hover:underline"
            >
              {item}
            </a>
          ))}
        </div>
      )
    },
    [],
  )

  return (
    <footer className="hidden sm:flex flex-col border-t border-slate-500/20 dark:border-slate-400/5 pt-[72px] pb-10" {...props}>
      <Container maxWidth="5xl" className="grid grid-cols-1 md:grid-cols-[176px_auto] mx-auto px-4 gap-4">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-start gap-1 pt-2">
            <ZenlinkIcon height={20} />
            <Typography weight={800} >Zenlink</Typography>
          </div>
          <div className="text-sm sm:text-[0.625rem] leading-5 sm:leading-4 text-slate-600 dark:text-slate-400">
            We are building a protocol for decentralized exchange in Polkadot ecosystem.
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/zenlinkpro" target="_blank" rel="noopener noreferrer">
              <GithubIcon width={16} className="text-slate-700 dark:text-slate-300 hover:text-slate-500 hover:dark:text-slate-50" />
            </a>
            <a href="https://twitter.com/ZenlinkPro" target="_blank" rel="noopener noreferrer">
              <TwitterIcon width={16} className="text-slate-700 dark:text-slate-300 hover:text-slate-500 hover:dark:text-slate-50" />
            </a>
            <a href="https://discord.com/invite/v32WcymvXn" target="_blank" rel="noopener noreferrer">
              <DiscordIcon width={16} className="text-slate-700 dark:text-slate-300 hover:text-slate-500 hover:dark:text-slate-50" />
            </a>
          </div>
        </div>
        <div className="md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-[40px] sm:mt-[10px]">
          {Object.entries(config).map(([title, items], i) => {
            if (Array.isArray(items)) {
              return (
                <div key={i} className="flex flex-col gap-6">
                  {items.map(item =>
                    Object.entries(item).map(([_title, _items]) => {
                      return leafNode(_title, _items)
                    }),
                  )}
                </div>
              )
            }
            else {
              return leafNode(title, items)
            }
          })}
        </div>
      </Container>
      <Container maxWidth="5xl" className="mx-auto mt-20 mb-2">
        <div className="flex justify-start py-2 mx-4 border-t border-slate-500/20 dark:border-slate-400/5">
          <Link.External href="https://zenlink.pro">
            <Typography variant="xs" weight={500} className="px-3 text-slate-700 dark:text-slate-300">
              <Trans>Powered By Zenlink</Trans>
            </Typography>
          </Link.External>
        </div>
      </Container>
    </footer>
  )
}
