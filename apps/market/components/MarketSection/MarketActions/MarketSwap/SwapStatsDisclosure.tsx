import { type FC, useMemo } from 'react'
import { useSettings } from '@zenlink-interface/shared'
import { Percent } from '@zenlink-interface/math'
import { Loader, Skeleton, Tooltip, Typography, classNames } from '@zenlink-interface/ui'
import { Trans } from '@lingui/macro'
import { Disclosure, Transition } from '@headlessui/react'
import { Rate } from 'components'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { formatTransactionAmount } from '@zenlink-interface/format'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useTrade } from './TradeProvider'

export const SwapStatsDisclosure: FC = () => {
  const { trade, isLoading, isSyncing } = useTrade()
  const [{ slippageTolerance }] = useSettings()

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const stats = useMemo(() => (
    <>
      <Typography className="text-slate-600 dark:text-slate-400" variant="sm">
        <Trans>Min. Received</Trans>
      </Typography>
      <Typography className="flex justify-end truncate text-slate-600 dark:text-slate-400" variant="sm" weight={500}>
        {
          (isLoading || isSyncing)
            ? <Skeleton.Box className="w-[60px] h-[20px] bg-black/[0.12] dark:bg-white/[0.06]" />
            : trade
              ? (
                <>
                  {trade?.minimumAmountOut(slippagePercent)?.toSignificant(6)}
                  {' '}
                  {trade?.minimumAmountOut(slippagePercent)?.currency.symbol}
                </>
                )
              : null
        }
      </Typography>
    </>
  ), [isLoading, isSyncing, slippagePercent, trade])

  return (
    <>
      <Transition
        className="p-3 !pb-1 transition-[max-height] overflow-hidden"
        enter="duration-300 ease-in-out"
        enterFrom="transform max-h-0"
        enterTo="transform max-h-screen"
        leave="transition-[max-height] duration-250 ease-in-out"
        leaveFrom="transform max-h-screen"
        leaveTo="transform max-h-0"
        show={!!trade || isLoading || isSyncing}
        unmount={false}
      >
        <Disclosure>
          {({ open }) => (
            <>
              <div className="flex justify-between border border-slate-500/20 hover:ring-1 items-center bg-white bg-opacity-[0.04] hover:bg-opacity-[0.08] rounded-2xl px-4 mb-4 py-2.5 gap-2">
                <Rate price={trade?.executionPrice}>
                  {({ content, toggleInvert, usdPrice }) => (
                    <div
                      className={classNames(
                        'text-sm text-slate-700 dark:text-slate-300 hover:dark:text-slate-50 hover:text-slate-800 cursor-pointer gap-1 font-semibold tracking-tight h-full flex items-center truncate',
                      )}
                      onClick={toggleInvert}
                    >
                      <Tooltip content={<div className="grid grid-cols-2 gap-1">{stats}</div>}>
                        {(isLoading || isSyncing) ? <Loader size={16} /> : <InformationCircleIcon height={16} width={16} />}
                      </Tooltip>
                      {
                        isLoading
                          ? (
                            <Typography className="text-slate-700 dark:text-slate-300" variant="sm" weight={600}>
                              <Trans>Finding best price...</Trans>
                            </Typography>
                            )
                          : (
                            <>
                              {content} {usdPrice && (<span className="font-medium text-slate-500">(${formatTransactionAmount(Number(usdPrice))})</span>)}
                            </>
                            )
                      }
                    </div>
                  )}
                </Rate>
                <Disclosure.Button className="flex items-center justify-end flex-grow cursor-pointer">
                  <ChevronDownIcon
                    className={classNames(
                      open ? '!rotate-180' : '',
                      (isLoading || isSyncing) && 'text-slate-400',
                      'rotate-0 transition-[transform] duration-300 ease-in-out delay-200',
                    )}
                    height={24}
                    width={24}
                  />
                </Disclosure.Button>
              </div>
              <Transition
                className="transition-[max-height] overflow-hidden"
                enter="duration-300 ease-in-out"
                enterFrom="transform max-h-0"
                enterTo="transform max-h-screen"
                leave="transition-[max-height] duration-250 ease-in-out"
                leaveFrom="transform max-h-screen"
                leaveTo="transform max-h-0"
                show={open}
                unmount={false}
              >
                <Disclosure.Panel
                  as="div"
                  className="grid grid-cols-2 gap-1 px-4 py-2 mb-4 border border-slate-500/20 dark:border-slate-200/5 rounded-2xl"
                >
                  {stats}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </Transition>
    </>
  )
}
