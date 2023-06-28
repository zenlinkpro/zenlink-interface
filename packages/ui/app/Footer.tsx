import { Trans } from '@lingui/macro'

import type { FC, ReactNode } from 'react'
import { Container, DiscordIcon, GithubIcon, Link, MantaDEXIcon, TwitterIcon, Typography, ZenlinkIcon } from '..'

export type FooterProps = React.HTMLProps<HTMLDivElement>

interface LinkItem {
  msgId: string
  name?: string | ReactNode
  href: string
  rel?: string
  target?: string
}

interface FootItem {
  titleMsgId: string
  title: string | ReactNode
  items: LinkItem[]
}

interface LeafNodeProps {
  titleMsgId: string
  title: string | ReactNode
  items: LinkItem[]
}

const LeafNode: FC<LeafNodeProps> = ({
  titleMsgId,
  title,
  items,
}) => {
  return (
    <div key={titleMsgId} className="flex flex-col gap-[10px]">
      <Typography variant="xs" weight={500} className="text-sm sm:text-xs text-slate-900 dark:text-slate-100">
       {title}
      </Typography>
      {Object.entries(items).map(([item, { href, name, rel, target }]) => (
        <a
          key={item}
          href={href}
          target={target}
          rel={rel}
          className="text-sm cursor-pointer sm:text-xs text-slate-600 dark:text-slate-400 hover:underline"
        >
          {name}
        </a>
      ))}
    </div>
  )
}

const config: Array<FootItem> = [
  {
    titleMsgId: 'Services',
    title: <Trans>Services</Trans>,
    items: [
      {
        msgId: 'Swap',
        name: <Trans>Swap</Trans>,
        href: 'https://manta-dex-app.vercel.app/swap',
      },
      {
        msgId: 'Pool',
        name: <Trans>Pool</Trans>,
        href: 'https://manta-dex-app.vercel.app/pool',
      },
      {
        msgId: 'Referrals',
        name: <Trans>Referrals</Trans>,
        href: 'https://manta-dex-app.vercel.app/referrals',
      },
      {
        msgId: 'Analytics',
        name: <Trans>Analytics</Trans>,
        href: 'https://manta-dex-app.vercel.app/analytics',
      },
    ],
  },
  {
    titleMsgId: 'Help',
    title: <Trans>Help</Trans>,
    items: [
      {
        msgId: 'About Us',
        name: <Trans>About Us</Trans>,
        href: 'https://manta.network/about.html',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      {
        msgId: 'Blog',
        name: <Trans>Blog</Trans>,
        href: 'https://mantanetwork.medium.com/',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      {
        msgId: 'Discord Support',
        name: <Trans>Discord Support</Trans>,
        href: 'https://discord.com/invite/mantanetwork',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      {
        msgId: 'Telegram Support',
        name: <Trans>Telegram Support</Trans>,
        href: 'https://www.t.me/mantanetworkofficial',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      {
        msgId: 'Twitter Support',
        name: <Trans>Twitter Support</Trans>,
        href: 'https://twitter.com/mantanetwork',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    ],
  },
  {
    titleMsgId: 'Developers',
    title: <Trans>Developers</Trans>,
    items: [
      {
        msgId: 'Wiki/Docs',
        name: <Trans>Wiki/Docs</Trans>,
        href: 'https://docs.manta.network',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      {
        msgId: 'GitHub',
        name: 'GitHub',
        href: 'https://github.com/Manta-Network',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    ],
  },
  {
    titleMsgId: 'Ecosystem',
    title: <Trans>Ecosystem</Trans>,
    items: [
      {
        msgId: 'Manta Pay',
        name: <Trans>Manta Pay</Trans>,
        href: 'https://app.manta.network/',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      {
        msgId: 'NPO',
        name: <Trans>NPO</Trans>,
        href: 'https://npo.manta.network/',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      {
        msgId: 'More',
        name: <Trans>More</Trans>,
        href: 'https://manta.network/ecosystem.html',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    ],
  },
]

export function Footer(props: FooterProps): JSX.Element {
  return (
    <footer className="hidden sm:flex flex-col border-t border-slate-500/20 dark:border-slate-400/5 pt-[72px] pb-10" {...props}>
      <Container maxWidth="5xl" className="grid grid-cols-1 md:grid-cols-[176px_auto] mx-auto px-4 gap-4">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-start gap-2 pt-2">
            <MantaDEXIcon height={28} width={28} className="brightness-0 dark:brightness-100" />
            <Typography weight={500} >Manta DEX</Typography>
          </div>
          <div className="text-sm sm:text-[0.625rem] leading-5 sm:leading-4 text-slate-600 dark:text-slate-400">
            <Trans>We are building a protocol for decentralized exchange in Polkadot ecosystem.</Trans>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/Manta-Network" target="_blank" rel="noopener noreferrer">
              <GithubIcon width={16} className="text-slate-700 dark:text-slate-300 hover:text-slate-500 hover:dark:text-slate-50" />
            </a>
            <a href="https://twitter.com/mantanetwork" target="_blank" rel="noopener noreferrer">
              <TwitterIcon width={16} className="text-slate-700 dark:text-slate-300 hover:text-slate-500 hover:dark:text-slate-50" />
            </a>
            <a href="https://discord.com/invite/mantanetwork" target="_blank" rel="noopener noreferrer">
              <DiscordIcon width={16} className="text-slate-700 dark:text-slate-300 hover:text-slate-500 hover:dark:text-slate-50" />
            </a>
          </div>
        </div>
        <div className="md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-[40px] sm:mt-[10px]">
          {config.map((item) => {
            return <LeafNode key={item.titleMsgId} titleMsgId={item.titleMsgId} title={item.title} items={item.items}/>
          })}
        </div>
      </Container>
      <Container maxWidth="5xl" className="mx-auto mt-20 mb-2">
        <div className="flex justify-start py-2 mx-4 border-t border-slate-500/20 dark:border-slate-400/5">
          <Link.External href="https://manta.network">
            <Typography variant="xs" weight={500} className="px-3 text-slate-700 dark:text-slate-300">
              <Trans>Powered By Manta Network</Trans>
            </Typography>
          </Link.External>
        </div>
      </Container>
    </footer>
  )
}
