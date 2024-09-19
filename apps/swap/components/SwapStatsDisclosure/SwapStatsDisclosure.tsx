import type { FC } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { t, Trans } from '@lingui/macro'
import { TradeVersion } from '@zenlink-interface/amm'
import { formatTransactionAmount } from '@zenlink-interface/format'
import { Percent } from '@zenlink-interface/math'
import { useSettings } from '@zenlink-interface/shared'
import { classNames, Loader, Skeleton, Tooltip, Typography } from '@zenlink-interface/ui'
import { AggregatorRoute, LegacyRoute, Rate, useTrade } from 'components'
import React, { useMemo, useState } from 'react'
import { warningSeverity } from '../../lib/functions'

export const SwapStatsDisclosure: FC = () => {
  const { trade, isLoading, isSyncing } = useTrade()
  const [showRoute, setShowRoute] = useState(false)

  const [{ slippageTolerance }] = useSettings()
  const priceImpactSeverity = useMemo(() => warningSeverity(trade?.priceImpact), [trade?.priceImpact])

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const stats = useMemo(() => (
    <>
      <Typography className="text-slate-600 dark:text-slate-400" variant="sm">
        <Trans>Price Impact</Trans>
      </Typography>
      <Typography
        className={classNames(
          priceImpactSeverity === 2 ? 'text-yellow' : priceImpactSeverity > 2 ? 'text-red' : 'text-slate-800 dark:text-slate-200',
          'flex justify-end truncate',
        )}
        variant="sm"
        weight={500}
      >
        {(isLoading || isSyncing)
          ? <Skeleton.Box className="w-[60px] h-[20px] bg-black/[0.12] dark:bg-white/[0.06]" />
          : trade
            ? (
                <>
                  {trade?.priceImpact?.multiply(-1).toFixed(2)}
                  %
                </>
              )
            : null}
      </Typography>
      <div className="col-span-2 border-t border-slate-500/20 dark:border-slate-200/5 w-full py-0.5" />
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
      <Typography className="text-slate-600 dark:text-slate-400" variant="sm">
        <Trans>Optimized Route</Trans>
      </Typography>
      <Typography
        className="cursor-pointer text-blue-600 hover:text-blue-400 text-right"
        onClick={() => setShowRoute(prev => !prev)}
        variant="sm"
        weight={500}
      >
        {showRoute ? t`Hide` : t`Show`}
      </Typography>
      {trade?.version === TradeVersion.LEGACY && (
        <Transition show={showRoute}>
          <div className="col-span-2 transition-[max-height] overflow-hidden duration-300 ease-in-out max-h-screen data-[closed]:max-h-0">
            <LegacyRoute />
          </div>
        </Transition>
      )}
    </>
  ), [isLoading, isSyncing, priceImpactSeverity, showRoute, slippagePercent, trade])

  return (
    <>
      <Transition
        as="div"
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
                        (isLoading || isSyncing) && 'text-opacity-50',
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
                <DisclosureButton className="flex items-center justify-end flex-grow cursor-pointer">
                  <ChevronDownIcon
                    className={classNames(
                      open ? '!rotate-180' : '',
                      (isLoading || isSyncing) && 'text-slate-400',
                      'rotate-0 transition-[transform] duration-300 ease-in-out delay-200',
                    )}
                    height={24}
                    width={24}
                  />
                </DisclosureButton>
              </div>
              <Transition show={open}>
                <DisclosurePanel
                  as="div"
                  className="transition-[max-height] overflow-hidden duration-300 ease-in-out max-h-screen data-[closed]:max-h-0 grid grid-cols-2 gap-1 px-4 py-2 mb-4 border border-slate-500/20 dark:border-slate-200/5 rounded-2xl"
                >
                  {stats}
                </DisclosurePanel>
              </Transition>
            </>
          )}
        </Disclosure>
        {trade?.version === TradeVersion.AGGREGATOR && <AggregatorRoute open={showRoute} setOpen={setShowRoute} trade={trade} />}
      </Transition>
    </>
  )
}
