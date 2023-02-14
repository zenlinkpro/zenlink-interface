import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import type { AggregatorTrade, BaseToken, PoolType } from '@zenlink-interface/amm'
import { TradeVersion } from '@zenlink-interface/amm'
import chains from '@zenlink-interface/chain'
import type { Type } from '@zenlink-interface/currency'
import { Native, Token } from '@zenlink-interface/currency'
import { AppearOnMount, Chip, Currency, Link, Tooltip, Typography } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { memo } from 'react'

import type { UseTradeOutput } from 'lib/hooks'
import { useTrade } from './TradeProvider'

const tokenFromBaseToken = (token: BaseToken) => {
  if (!token.address)
    return Native.onChain(Number(token.chainId))
  return new Token({
    address: token.address,
    symbol: token.symbol,
    chainId: Number(token.chainId),
    decimals: 18,
  })
}

export const SingleRoute: FC<UseTradeOutput> = ({ trade }) => {
  if (!trade)
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
      {trade.descriptions.map((desc, i) => (
        <Tooltip
          key={i}
          mouseEnterDelay={0.4}
          button={
            <div
              key={i}
              className="py-1 px-1.5 flex items-center gap-1.5 bg-slate-700 cursor-pointer hover:bg-slate-600 rounded-lg overflow-hidden"
            >
              <Currency.IconList iconWidth={20} iconHeight={20}>
                <Currency.Icon currency={desc.input} />
                <Currency.Icon currency={desc.output} />
              </Currency.IconList>
              <Typography variant="sm" weight={500} className="py-0.5">
                {desc.fee}%
              </Typography>
            </div>
          }
          panel={
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <Currency.IconList iconWidth={20} iconHeight={20}>
                  <Currency.Icon currency={desc.input} />
                  <Currency.Icon currency={desc.output} />
                </Currency.IconList>
                <Typography variant="sm" weight={500} className="flex gap-1 text-slate-50">
                  {desc.input.symbol} <span className="text-slate-500">/</span> {desc.output.symbol}
                </Typography>
                <Link.External href={chains[trade.inputAmount.currency.chainId].getTokenUrl(desc.poolAddress || '')}>
                  <div className="pl-1 -mt-0.5">
                    <ArrowTopRightOnSquareIcon className="text-blue hover:text-blue-400" width={18} height={18} />
                  </div>
                </Link.External>
              </div>
              <Typography variant="xs" weight={500} className="flex gap-1.5 items-end text-slate-400">
                <Chip color="gray" size="sm" label={desc.poolType} />
                <Chip color="gray" size="sm" label={`Fee ${desc.fee}%`} />
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

interface ComplexRoutePathProps {
  fromToken: Type
  toToken: Type
  poolType: PoolType
  poolFee: number
  portion: number
  poolAddress: string
}

const ComplexRoutePath: FC<ComplexRoutePathProps> = ({ fromToken, toToken, poolType, poolFee, portion, poolAddress }) => {
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
      <div className="flex gap-2 items-center w-2/5">
        <div className="w-6 h-6">
          <Currency.Icon currency={fromToken} width={24} height={24} />
        </div>
        <div className="py-1 px-1.5 flex items-center gap-1.5 bg-slate-700 cursor-pointer hover:bg-slate-600 rounded-lg overflow-hidden">
          <Typography variant="sm" weight={500} className="py-0.5 flex items-center gap-1">
            <p className="text-slate-400">{poolType === 'Unknown' ? 'Wrap' : poolType}</p>
            {Number(portion * 100).toFixed(0)}%
          </Typography>
        </div>
      </div>
      <Tooltip
        mouseEnterDelay={0.4}
        button={
          <div className="py-1 px-1.5 flex items-center gap-1.5 bg-slate-700 cursor-pointer hover:bg-slate-600 rounded-lg overflow-hidden">
            <Currency.IconList iconWidth={20} iconHeight={20}>
              <Currency.Icon currency={fromToken} />
              <Currency.Icon currency={toToken} />
            </Currency.IconList>
            <Typography variant="sm" weight={500} className="py-0.5">
              {Number(poolFee * 100).toFixed(2)}%
            </Typography>
          </div>
        }
        panel={
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <Currency.IconList iconWidth={20} iconHeight={20}>
                <Currency.Icon currency={fromToken} />
                <Currency.Icon currency={toToken} />
              </Currency.IconList>
              <Typography variant="sm" weight={500} className="flex gap-1 text-slate-50">
                {fromToken.symbol} <span className="text-slate-500">/</span> {toToken.symbol}
              </Typography>
              <Link.External href={chains[fromToken.chainId].getTokenUrl(poolAddress)}>
                <div className="pl-1 -mt-0.5">
                  <ArrowTopRightOnSquareIcon className="text-blue hover:text-blue-400" width={18} height={18} />
                </div>
              </Link.External>
            </div>
            <Typography variant="xs" weight={500} className="flex gap-1.5 items-end text-slate-400">
              <Chip color="gray" size="sm" label={poolType} />
              <Chip color="gray" size="sm" label={`Fee ${Number(poolFee * 100).toFixed(2)}%`} />
            </Typography>
          </div>
        }
      />
      <div className="w-6 h-6">
        <Currency.Icon currency={toToken} width={24} height={24} />
      </div>
    </div>
  )
}

export const ComplexRoute: FC<{ trade: AggregatorTrade }> = ({ trade }) => {
  if (!trade)
    return <></>

  const inputAddress = trade.inputAmount.currency.isNative
    ? ''
    : trade.inputAmount.currency.address
  const outputAddress = trade.outputAmount.currency.isNative
    ? ''
    : trade.outputAmount.currency.address

  const directPaths = trade.routeLegs.filter(
    leg => leg.tokenFrom.address === inputAddress && leg.tokenTo.address === outputAddress,
  )

  const initialPaths = trade.routeLegs.filter(
    leg => leg.tokenFrom.address === inputAddress && leg.tokenTo.address !== outputAddress,
  )

  // TODO: Seperate into groups of tokenFrom
  const percentPaths = trade.routeLegs.filter(
    leg => leg.tokenFrom.address !== inputAddress && leg.tokenTo.address !== outputAddress,
  )

  const finalPaths = trade.routeLegs.filter(
    leg => leg.tokenFrom.address !== inputAddress && leg.tokenTo.address === outputAddress,
  )

  return (
    <div className="flex">
      <div className="flex flex-col gap-3 w-full">
        {[
          ...directPaths,
          ...initialPaths,
          ...percentPaths,
          ...finalPaths,
        ].map((directPath, i) => (
          <ComplexRoutePath
            key={i}
            fromToken={tokenFromBaseToken(directPath.tokenFrom)}
            toToken={tokenFromBaseToken(directPath.tokenTo)}
            poolType={directPath.poolType}
            poolFee={directPath.poolFee}
            portion={directPath.absolutePortion}
            poolAddress={directPath.poolAddress}
          />
        ))}
      </div>
    </div>
  )
}

export const Route: FC = memo(() => {
  const { trade, isLoading, isSyncing } = useTrade()
  if (!trade || isLoading || isSyncing)
    return <></>

  return (
    <AppearOnMount>
      <div className="pt-2">
        {trade.version === TradeVersion.LEGACY && <SingleRoute trade={trade} />}
        {trade.version === TradeVersion.AGGREGATOR && <ComplexRoute trade={trade} />}
      </div>
    </AppearOnMount>
  )
})
