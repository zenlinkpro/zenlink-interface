import { Disclosure, Transition } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Percent } from '@zenlink-interface/math'
import { Loader, Skeleton, Tooltip, Typography, classNames } from '@zenlink-interface/ui'
import { Rate, Route, useTrade } from 'components'
import type { FC } from 'react'
import React, { useMemo, useState } from 'react'

import { useSettings } from '@zenlink-interface/shared'
import { warningSeverity } from '../../lib/functions'

export const SwapStatsDisclosure: FC = () => {
  const { trade, isLoading } = useTrade()
  const [showRoute, setShowRoute] = useState(false)

  const [{ slippageTolerance }] = useSettings()
  const priceImpactSeverity = useMemo(() => warningSeverity(trade?.priceImpact), [trade?.priceImpact])

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const stats = useMemo(() => (
    <>
      <Typography variant="sm" className="text-slate-400">
        Price Impact
      </Typography>
      <Typography
        variant="sm"
        weight={500}
        className={classNames(
          priceImpactSeverity === 2 ? 'text-yellow' : priceImpactSeverity > 2 ? 'text-red' : 'text-slate-200',
          'flex justify-end truncate',
        )}
      >
        {trade
          ? <>{trade?.priceImpact?.multiply(-1).toFixed(2)}%</>
          : isLoading
            ? <Skeleton.Box className="w-[60px] h-[20px] bg-white/[0.06]" />
            : null
        }
      </Typography>
      <div className="col-span-2 border-t border-slate-200/5 w-full py-0.5" />
      <Typography variant="sm" className="text-slate-400">
        Min. Received
      </Typography>
      <Typography variant="sm" weight={500} className="flex justify-end truncate text-slate-400">
        {trade
          ? (
              <>
                {trade?.minimumAmountOut(slippagePercent)?.toSignificant(6)}{' '}
                {trade?.minimumAmountOut(slippagePercent)?.currency.symbol}
              </>
            )
          : isLoading
            ? <Skeleton.Box className="w-[60px] h-[20px] bg-white/[0.06]" />
            : null
        }
      </Typography>
      <Typography variant="sm" className="text-slate-400">
        Optimized Route
      </Typography>
      <Typography
        onClick={() => setShowRoute(prev => !prev)}
        variant="sm"
        weight={500}
        className="cursor-pointer text-blue hover:text-blue-400 text-right"
      >
        {showRoute ? 'Hide' : 'Show'}
      </Typography>
      <Transition
        show={showRoute}
        unmount={false}
        className="col-span-2 transition-[max-height] overflow-hidden"
        enter="duration-300 ease-in-out"
        enterFrom="transform max-h-0"
        enterTo="transform max-h-[380px]"
        leave="transition-[max-height] duration-250 ease-in-out"
        leaveFrom="transform max-h-[380px]"
        leaveTo="transform max-h-0"
      >
        <div className="col-span-2">
          <Route />
        </div>
      </Transition>
    </>
  ), [isLoading, priceImpactSeverity, showRoute, slippagePercent, trade])

  return (
    <>
      <Transition
        show={!!trade || isLoading}
        className="p-3 !pb-1 transition-[max-height] overflow-hidden"
        enter="duration-300 ease-in-out"
        enterFrom="transform max-h-0"
        enterTo="transform max-h-[380px]"
        leave="transition-[max-height] duration-250 ease-in-out"
        leaveFrom="transform max-h-[380px]"
        leaveTo="transform max-h-0"
      >
        <Disclosure>
          {({ open }) => (
            <>
              <div className="flex justify-between items-center bg-white bg-opacity-[0.04] hover:bg-opacity-[0.08] rounded-2xl px-4 mb-4 py-2.5 gap-2">
                <Rate price={trade?.executionPrice}>
                  {({ content, toggleInvert, usdPrice }) => (
                    <div
                      className="text-sm text-slate-300 hover:text-slate-50 cursor-pointer gap-1 font-semibold tracking-tight h-full flex items-center truncate"
                      onClick={toggleInvert}
                    >
                      <Tooltip
                        panel={<div className="grid grid-cols-2 gap-1">{stats}</div>}
                        button={isLoading ? <Loader size={15} /> : <InformationCircleIcon width={16} height={16} />}
                      />{' '}
                      {isLoading
                        ? <Typography weight={600} variant="sm" className="text-slate-400 ml-1">{'Fetching best price...'}</Typography>
                        : content
                      } {usdPrice && <span className="font-medium text-slate-500">(${usdPrice})</span>}
                    </div>
                  )}
                </Rate>
                <Disclosure.Button className="flex items-center justify-end flex-grow cursor-pointer">
                  <ChevronDownIcon
                    width={24}
                    height={24}
                    className={classNames(
                      open ? '!rotate-180' : '',
                      isLoading && 'text-slate-400',
                      'rotate-0 transition-[transform] duration-300 ease-in-out delay-200',
                    )}
                  />
                </Disclosure.Button>
              </div>
              <Transition
                show={open}
                className="transition-[max-height] overflow-hidden"
                enter="duration-300 ease-in-out"
                enterFrom="transform max-h-0"
                enterTo="transform max-h-[380px]"
                leave="transition-[max-height] duration-250 ease-in-out"
                leaveFrom="transform max-h-[380px]"
                leaveTo="transform max-h-0"
              >
                <Disclosure.Panel
                  as="div"
                  className="grid grid-cols-2 gap-1 px-4 py-2 mb-4 border border-slate-200/5 rounded-2xl"
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
