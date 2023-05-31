import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import type { AggregatorTrade, BaseToken, PoolType } from '@zenlink-interface/amm'
import { TradeVersion } from '@zenlink-interface/amm'
import chains from '@zenlink-interface/chain'
import type { Type } from '@zenlink-interface/currency'
import { Native, Token } from '@zenlink-interface/currency'
import {
  AppearOnMount,
  Chip,
  Currency,
  Dialog,
  Link,
  Skeleton,
  Tooltip,
  Typography,
} from '@zenlink-interface/ui'
import type { Dispatch, FC, SetStateAction } from 'react'
import { memo, useCallback } from 'react'
import type { UseTradeOutput } from 'lib/hooks'
import { Trans } from '@lingui/macro'
import { useTrade } from './TradeProvider'
import { Sankey } from './Charts'

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
      <div className="absolute inset-0 left-1 right-1 flex items-center text-slate-600 pointer-events-none z-[-1]">
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
          content={
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <Currency.IconList iconWidth={20} iconHeight={20}>
                  <Currency.Icon currency={desc.input} />
                  <Currency.Icon currency={desc.output} />
                </Currency.IconList>
                <Typography variant="sm" weight={500} className="flex gap-1 text-slate-900 dark:text-slate-50">
                  {desc.input.symbol} <span className="text-slate-500">/</span> {desc.output.symbol}
                </Typography>
                <Link.External href={chains[trade.inputAmount.currency.chainId].getTokenUrl(desc.poolAddress || '')}>
                  <div className="pl-1 -mt-0.5">
                    <ArrowTopRightOnSquareIcon className="text-blue hover:text-blue-400" width={18} height={18} />
                  </div>
                </Link.External>
              </div>
              <Typography variant="xs" weight={500} className="flex gap-1.5 items-end">
                <Chip color="gray" size="sm" label={desc.poolType} />
                <Chip color="gray" size="sm" label={`Fee ${desc.fee}%`} />
              </Typography>
            </div>
          }
        >
          <div
            key={i}
            className="py-1 px-1.5 flex items-center gap-1.5 bg-slate-300 dark:bg-slate-700 cursor-pointer rounded-lg overflow-hidden"
          >
            <Currency.IconList iconWidth={20} iconHeight={20}>
              <Currency.Icon currency={desc.input} />
              <Currency.Icon currency={desc.output} />
            </Currency.IconList>
            <Typography variant="sm" weight={500} className="py-0.5">
              {desc.fee}%
            </Typography>
          </div>
        </Tooltip>
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
  protocol: string | undefined
}

const ComplexRoutePath: FC<ComplexRoutePathProps> = ({
  fromToken,
  toToken,
  poolType,
  protocol,
  poolFee,
  portion,
  poolAddress,
}) => {
  return (
    <div className="flex justify-between items-center gap-1 relative">
      <div className="absolute inset-0 left-1 right-1 flex items-center text-slate-600 pointer-events-none z-[-1]">
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
      <div className="flex gap-2 items-center w-1/2 md:w-2/5">
        <div className="w-5 h-5">
          <Currency.Icon currency={fromToken} width={20} height={20} />
        </div>
        <div className="py-0.5 px-1 flex items-center gap-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
          <Typography variant="sm" weight={500} className="py-0.5 flex items-center gap-1">
            <p className="text-slate-700 dark:text-slate-400 text-xs">{protocol ?? 'Unknown'}</p>
            {Number(portion * 100).toFixed(0)}%
          </Typography>
        </div>
      </div>
      <Tooltip
        content={
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <Currency.IconList iconWidth={20} iconHeight={20}>
                <Currency.Icon currency={fromToken} />
                <Currency.Icon currency={toToken} />
              </Currency.IconList>
              <Typography variant="sm" weight={500} className="flex gap-1 text-slate-900 dark:text-slate-50">
                {fromToken.symbol} <span className="text-slate-500">/</span> {toToken.symbol}
              </Typography>
              <Link.External href={chains[fromToken.chainId].getTokenUrl(poolAddress)}>
                <div className="pl-1 -mt-0.5">
                  <ArrowTopRightOnSquareIcon className="text-blue hover:text-blue-400" width={18} height={18} />
                </div>
              </Link.External>
            </div>
            <Typography variant="xs" weight={500} className="flex gap-1 items-end">
              <Chip color="gray" size="sm" label={poolType} />
              <Chip color="gray" size="sm" label={`Fee ${Number(poolFee * 100).toFixed(2)}%`} />
            </Typography>
          </div>
        }
      >
        <div className="py-0.5 px-1 flex items-center bg-slate-200 dark:bg-slate-700 cursor-pointer rounded-lg overflow-hidden">
          <Currency.IconList iconWidth={20} iconHeight={20}>
            <Currency.Icon currency={fromToken} />
            <Currency.Icon currency={toToken} />
          </Currency.IconList>
          <Typography variant="sm" weight={500} className="py-0.5">
            {Number(poolFee * 100).toFixed(2)}%
          </Typography>
        </div>
      </Tooltip>
      <div className="w-5 h-5">
        <Currency.Icon currency={toToken} width={20} height={20} />
      </div>
    </div>
  )
}

export const ComplexRoute: FC<{ trade: AggregatorTrade }> = ({ trade }) => {
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
        ].map((path, i) => (
          <ComplexRoutePath
            key={i}
            fromToken={tokenFromBaseToken(path.tokenFrom)}
            toToken={tokenFromBaseToken(path.tokenTo)}
            poolType={path.poolType}
            poolFee={path.poolFee}
            portion={path.absolutePortion}
            poolAddress={path.poolAddress}
            protocol={path.protocol}
          />
        ))}
      </div>
    </div>
  )
}

export const AggregatorRoute: FC<{
  trade: AggregatorTrade
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}> = ({ trade, open, setOpen }) => {
  const onClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Content className="!pb-2 !px-0 dark:!bg-slate-800 bg-white">
        <Dialog.Header title={<Trans>Optimized route</Trans>} onClose={onClose} />
        <div className="px-5 py-2 gap-4 flex flex-col">
          <div className="bg-slate-400/10 rounded-xl w-full overflow-x-auto">
            <Sankey trade={trade} />
          </div>
          <div className="p-2 max-h-[380px] overflow-y-auto">
            <ComplexRoute trade={trade} />
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}

export const LegacyRoute: FC = memo(() => {
  const { trade, isLoading } = useTrade()

  return (
    <AppearOnMount>
      {!trade || isLoading
        ? <Skeleton.Box className="mt-2 w-full h-8 bg-black/[0.12] dark:bg-white/[0.06]" />
        : (
          <div className="pt-2">
            {trade.version === TradeVersion.LEGACY && <SingleRoute trade={trade} />}
          </div>
          )
      }
    </AppearOnMount>
  )
})
