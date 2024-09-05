import { ListboxButton, Transition } from '@headlessui/react'
import { ArrowTopRightOnSquareIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import useScrollPosition from '@react-hook/window-scroll'
import { useIsMounted } from '@zenlink-interface/hooks'
import React from 'react'

import type { MaxWidth } from '..'
import {
  Container,
  IconButton,
  Link,
  Select,
  Typography,
  ZenlinkIcon,
  classNames,
  useBreakpoint,
} from '..'

export enum AppType {
  Root = 'Explore Apps',
  Swap = 'Swap',
  Pool = 'Pool',
  Eden = 'Eden',
  Gauge = 'Gauge',
  Referrals = 'Referrals',
  Analytics = 'Analytics',
  Legacy = 'Old App',
}

export interface HeaderProps extends React.HTMLProps<HTMLElement> {
  nav?: JSX.Element
  withScrollBackground?: boolean
  apptype: AppType
  maxWidth?: MaxWidth
  bgColor?: string
}

export function Header({
  children,
  className,
  nav,
  withScrollBackground = false,
  bgColor = 'bg-white dark:bg-slate-900',
  maxWidth = 'full',
  ...props
}: HeaderProps): JSX.Element {
  const isMounted = useIsMounted()
  const scrollY = useScrollPosition()

  const { isMd } = useBreakpoint('md')

  // Show when:
  // 1. We scroll down for 45px
  // 2. When body has a negative top set for body lock for Dialogs on small screens
  const showBackground
    = (scrollY > 45 && withScrollBackground && isMounted)
    || (typeof window !== 'undefined' && !isMd
      ? Number(document.body.style.top.slice(0, -2)) < 0 && withScrollBackground
      : false)

  return (
    <header
      className={classNames(
        'sticky mt-0 flex items-center left-0 right-0 top-0 w-full z-[1070] h-[54px]',
        className,
      )}
      {...props}
    >
      <Transition show={showBackground || !withScrollBackground}>
        <div className={classNames(bgColor, 'transform transition ease-in-out duration-200 data-[closed]:translate-y-[-100%] absolute inset-0 border-b pointer-events-none border-slate-500/20 dark:border-slate-200/10')} />
      </Transition>
      <Container
        className={classNames('flex items-center w-full mx-auto z-[101] py-1 px-4 row-full')}
        maxWidth={maxWidth}
      >
        <div className="flex items-center flex-grow gap-4">
          <a className="flex flex-row items-center gap-1.5" href="/">
            <div className="w-6 h-6">
              <ZenlinkIcon className="mr-2 hover:animate-heartbeat" height="100%" width="100%" />
            </div>
          </a>
          <div className="bg-slate-500/20 dark:bg-slate-200/10 w-0.5 h-[20px]" />
          <div className="hidden md:flex justify-center gap-1 relative">{nav}</div>
          <Select
            button={(
              <ListboxButton
                className="md:-ml-3 flex items-center font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-300/20 dark:hover:bg-slate-500/20 rounded-lg"
                type="button"
              >
                <IconButton as="div" className="p-1">
                  <EllipsisHorizontalIcon aria-hidden="true" className="w-7 h-7" />
                </IconButton>
              </ListboxButton>
            )}
          >
            <Select.Options className="!w-[max-content] -ml-5 mt-5 !max-h-[unset]">
              <div className="grid grid-cols-1 gap-1 px-2 py-2 md:grid-cols-3">
                <div>
                  <Typography className="hidden px-2 mb-1 uppercase md:block text-slate-600 dark:text-slate-400" variant="xs" weight={600}>
                    <Trans>Core</Trans>
                  </Typography>
                  <Select.Option
                    as="a"
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                    href="/swap"
                    key={AppType.Swap}
                    value={AppType.Swap}
                  >
                    <Trans>Swap</Trans>
                    <Typography className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-blue-100" variant="xs">
                      <Trans>The easiest way to trade</Trans>
                    </Typography>
                  </Select.Option>
                  <Select.Option
                    as="a"
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                    href="/pool"
                    key={AppType.Pool}
                    value={AppType.Pool}
                  >
                    <Trans>Pool</Trans>
                    <Typography className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-blue-100" variant="xs">
                      <Trans>Pool your liquidity to generate LP tokens</Trans>
                    </Typography>
                  </Select.Option>
                  <Select.Option
                    as="a"
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                    href="/market"
                    key={AppType.Eden}
                    value={AppType.Eden}
                  >
                    <Trans>Eden</Trans>
                    <Typography className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-blue-100" variant="xs">
                      <Trans>Execute advanced yield strategies</Trans>
                    </Typography>
                  </Select.Option>
                </div>
                <div>
                  <Typography className="hidden px-2 mb-1 uppercase md:block text-slate-600 dark:text-slate-400" variant="xs" weight={600}>
                    <Trans>Products</Trans>
                  </Typography>
                  <Select.Option
                    as="a"
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                    href="/gauge"
                    key={AppType.Gauge}
                    value={AppType.Gauge}
                  >
                    <Trans>Gauge</Trans>
                    <Typography className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-blue-100" variant="xs">
                      <Trans>Lock ZLK for veZLK to participate in governance</Trans>
                    </Typography>
                  </Select.Option>
                  <Select.Option
                    as="a"
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                    href="/referrals"
                    key={AppType.Referrals}
                    value={AppType.Referrals}
                  >
                    <Trans>Referrals</Trans>
                    <Typography className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-blue-100" variant="xs">
                      <Trans>Get fee discounts and earn rebates</Trans>
                    </Typography>
                  </Select.Option>
                  <Select.Option
                    as="a"
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                    href="/analytics"
                    key={AppType.Analytics}
                    value={AppType.Analytics}
                  >
                    <Trans>Analytics</Trans>
                    <Typography className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-blue-100" variant="xs">
                      <Trans>Analytics platform for tracking the products</Trans>
                    </Typography>
                  </Select.Option>
                </div>
                <div>
                  <Typography className="hidden px-2 mb-1 uppercase md:block text-slate-600 dark:text-slate-400" variant="xs" weight={600}>
                    <Trans>Links</Trans>
                  </Typography>
                  <Select.Option
                    as={Link.External}
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start !no-underline group"
                    href="https://dex.zenlink.pro"
                    key={AppType.Legacy}
                    value={AppType.Legacy}
                  >
                    <div className="flex items-center gap-1 text-black dark:text-white">
                      <span><Trans>Old App</Trans></span>
                      <ArrowTopRightOnSquareIcon height={14} width={14} />
                    </div>
                    <Typography className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-blue-100" variant="xs">
                      <Trans>Missing features or prefer the old app?</Trans>
                    </Typography>
                  </Select.Option>
                </div>
              </div>
            </Select.Options>
          </Select>
        </div>
        <div className="flex justify-end flex-grow">{children}</div>
      </Container>
    </header>
  )
}

export default Header
