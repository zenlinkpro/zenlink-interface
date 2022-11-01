import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import chains from '@zenlink-interface/chain'
import { AppearOnMount, Chip, Currency, Link, Tooltip, Typography } from '@zenlink-interface/ui'
import type { UseTradeOutput } from 'lib/hooks'
import type { FC } from 'react'

import { useTrade } from './TradeProvider'

// Can render an entire tines single route with dots between
export const SingleRoute: FC<UseTradeOutput> = ({ trade, route }) => {
  if (!trade || !route)
    return <></>

  return (
    <div className="flex justify-between items-center gap-1 relative">
      <div className="absolute inset-0 left-1 right-1 text-slate-600 pointer-events-none z-[-1]">
        <svg
          width="100%"
          height="35"
          viewBox="850 0 300 200"
          xmlns="http://www.w3.org/2000/svg"
          className="sc-o1ook0-5 iESzev"
        >
          <line
            x1="0"
            x2="3000"
            y1="100"
            y2="100"
            stroke="currentColor"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray="1, 45"
          />
        </svg>
      </div>
      <div className="w-6 h-6">
        <Currency.Icon currency={trade.inputAmount.currency} width={24} height={24} />
      </div>
      {route.routePath.map((route, i) => (
        <Tooltip
          key={i}
          mouseEnterDelay={0.4}
          button={
            <div
              key={i}
              className="py-1 px-1.5 flex items-center gap-1.5 bg-slate-700 cursor-pointer hover:bg-slate-600 rounded-lg overflow-hidden"
            >
              {route.stable && route.pool
                ? (
                  <>
                    <Currency.IconList iconWidth={20} iconHeight={20}>
                      <Currency.Icon currency={route.pool.liquidityToken} />
                      {route.basePool && <Currency.Icon currency={route.basePool.liquidityToken} />}
                    </Currency.IconList>
                    <Typography variant="sm" weight={600} className="py-0.5">
                      {0.05}%
                    </Typography>
                  </>
                  )
                : (
                  <>
                    <Currency.IconList iconWidth={20} iconHeight={20}>
                      <Currency.Icon currency={route.input} />
                      <Currency.Icon currency={route.output} />
                    </Currency.IconList>
                    <Typography variant="sm" weight={600} className="py-0.5">
                      {0.3}%
                    </Typography>
                  </>
                  )
              }
            </div>
          }
          panel={
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                {route.stable && route.pool
                  ? (
                    <div className='flex flex-1'>
                      <Currency.IconList iconWidth={20} iconHeight={20}>
                        <Currency.Icon currency={route.pool.liquidityToken} />
                        {route.basePool && <Currency.Icon currency={route.basePool.liquidityToken} />}
                      </Currency.IconList>
                      <Typography variant="sm" weight={600} className="flex ml-1 gap-1 text-slate-50">
                        {route.pool.liquidityToken.symbol}
                        {route.basePool && <><span className="text-slate-500">/</span> {route.basePool.liquidityToken.symbol}</>}
                      </Typography>
                    </div>
                    )
                  : (
                    <>
                      <Currency.IconList iconWidth={20} iconHeight={20}>
                        <Currency.Icon currency={route.input} />
                        <Currency.Icon currency={route.output} />
                      </Currency.IconList>
                      <Typography variant="sm" weight={600} className="flex gap-1 text-slate-50">
                        {route.input.symbol} <span className="text-slate-500">/</span> {route.output.symbol}
                      </Typography>
                    </>
                    )
                }
                <Link.External href={chains[trade.inputAmount.currency.chainId].getTokenUrl(route.pair?.liquidityToken.address || route.pool?.liquidityToken.address || '')}>
                  <div className="pl-1 -mt-0.5">
                    <ArrowTopRightOnSquareIcon className="text-blue hover:text-blue-400" width={18} height={18} />
                  </div>
                </Link.External>
              </div>
              <Typography variant="xs" weight={600} className="flex gap-1.5 items-end text-slate-400">
                <Chip color="gray" size="sm" label={route.stable ? 'Stable' : 'Standard'} />
                <Chip color="gray" size="sm" label={`Fee ${route.stable ? 0.05 : 0.3}%`} />
              </Typography>
            </div>
          }
        />
      ))}
      <div className="w-6 h-6">
        <Currency.Icon currency={trade.outputAmount.currency} width={24} height={24} />
      </div>
    </div>
  )
}

export const Route: FC = () => {
  const { trade, route } = useTrade()
  if (!trade || !route)
    return <></>

  return (
    <AppearOnMount>
      <div className="pt-2">
        {trade && <SingleRoute trade={trade} route={route} />}
      </div>
    </AppearOnMount>
  )
}
