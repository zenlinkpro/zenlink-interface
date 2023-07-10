import { Listbox, Transition } from '@headlessui/react'
import { ArrowTopRightOnSquareIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import useScrollPosition from '@react-hook/window-scroll'
import { useIsMounted } from '@zenlink-interface/hooks'
import React, { Fragment } from 'react'

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
      <Transition
        as={Fragment}
        show={showBackground || !withScrollBackground}
        enter="transform transition ease-in-out duration-100"
        enterFrom="translate-y-[-100%]"
        enterTo="translate-y-0"
        leave="transform transition ease-in-out duration-200"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-[-100%]"
      >
        <div className={classNames(bgColor, 'absolute inset-0 border-b pointer-events-none border-slate-500/20 dark:border-slate-200/10')} />
      </Transition>
      <Container
        maxWidth={maxWidth}
        className={classNames('flex items-center w-full mx-auto z-[101] py-1 px-4 row-full')}
      >
        <div className="flex items-center flex-grow gap-4">
          <a className="flex flex-row items-center gap-1.5" href="/">
            <div className="w-6 h-6">
              <ZenlinkIcon width="100%" height="100%" className="mr-2 hover:animate-heartbeat" />
            </div>
          </a>
          <div className="bg-slate-500/20 dark:bg-slate-200/10 w-0.5 h-[20px]" />
          <div className="hidden md:flex justify-center gap-1 relative">{nav}</div>
          <Select
            button={
              <Listbox.Button
                type="button"
                className="md:-ml-3 flex items-center font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-300/20 dark:hover:bg-slate-500/20 rounded-lg"
              >
                <IconButton as="div" className="p-1">
                  <EllipsisHorizontalIcon className="w-7 h-7" aria-hidden="true" />
                </IconButton>
              </Listbox.Button>
            }
          >
            <Select.Options className="!w-[max-content] -ml-5 mt-5 !max-h-[unset]">
              <div className="grid grid-cols-1 gap-1 px-2 py-2 md:grid-cols-3">
                <div>
                  <Typography variant="xs" weight={600} className="hidden px-2 mb-1 uppercase md:block text-slate-600 dark:text-slate-400">
                    <Trans>Core</Trans>
                  </Typography>
                  <Select.Option
                    as="a"
                    href="/swap"
                    key={AppType.Swap}
                    value={AppType.Swap}
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                  >
                    <Trans>Swap</Trans>
                    <Typography variant="xs" className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-blue-100">
                      <Trans>The easiest way to trade</Trans>
                    </Typography>
                  </Select.Option>
                  <Select.Option
                    as="a"
                    href="/pool"
                    key={AppType.Pool}
                    value={AppType.Pool}
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                  >
                    <Trans>Pool</Trans>
                    <Typography variant="xs" className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-blue-100">
                      <Trans>Pool your liquidity to generate LP tokens</Trans>
                    </Typography>
                  </Select.Option>
                </div>
                <div>
                  <Typography variant="xs" weight={600} className="hidden px-2 mb-1 uppercase md:block text-slate-600 dark:text-slate-400">
                    <Trans>Products</Trans>
                  </Typography>
                  <Select.Option
                    as="a"
                    href="/referrals"
                    key={AppType.Referrals}
                    value={AppType.Referrals}
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                  >
                    <Trans>Referrals</Trans>
                    <Typography variant="xs" className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-blue-100">
                      <Trans>Get fee discounts and earn rebates</Trans>
                    </Typography>
                  </Select.Option>
                  <Select.Option
                    as="a"
                    href="/analytics"
                    key={AppType.Analytics}
                    value={AppType.Analytics}
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start group"
                  >
                    <Trans>Analytics</Trans>
                    <Typography variant="xs" className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-blue-100">
                      <Trans>Analytics platform for tracking the products</Trans>
                    </Typography>
                  </Select.Option>
                </div>
                <div>
                  <Typography variant="xs" weight={600} className="hidden px-2 mb-1 uppercase md:block text-slate-600 dark:text-slate-400">
                    <Trans>Links</Trans>
                  </Typography>
                  <Select.Option
                    as={Link.External}
                    href="https://dex.zenlink.pro"
                    key={AppType.Legacy}
                    value={AppType.Legacy}
                    className="!border-slate-700 !cursor-pointer px-2 flex flex-col gap-0 !items-start !no-underline group"
                  >
                    <div className="flex items-center gap-1 text-black dark:text-white">
                      <span><Trans>Old App</Trans></span>
                      <ArrowTopRightOnSquareIcon width={14} height={14} />
                    </div>
                    <Typography variant="xs" className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-blue-100">
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
