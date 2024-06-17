import type { CurrencyInputProps } from '@zenlink-interface/compat'
import { tryParseAmount } from '@zenlink-interface/currency'
import { formatTransactionAmount } from '@zenlink-interface/format'
import { useIsMounted } from '@zenlink-interface/hooks'
import { usePrices } from '@zenlink-interface/shared'
import { Skeleton, Typography, classNames } from '@zenlink-interface/ui'
import { type FC, useMemo } from 'react'

type PricePanelProps = Pick<CurrencyInputProps, 'currency' | 'value' | 'usdPctChange'>
export const PricePanel: FC<PricePanelProps> = ({ currency, usdPctChange, value }) => {
  const isMounted = useIsMounted()
  const { data: tokenPrices } = usePrices({ chainId: currency?.chainId })
  const price = currency ? tokenPrices?.[currency.wrapped.address] : undefined
  const parsedValue = useMemo(() => tryParseAmount(value, currency), [currency, value])

  if (!isMounted) {
    return (
      <div className="h-[24px] w-[60px] flex items-center">
        <Skeleton.Box className="bg-black/[0.12] dark:bg-white/[0.06] h-[12px] w-full" />
      </div>
    )
  }

  return (
    <Typography className="select-none text-slate-700 dark:text-slate-400" variant="xs" weight={400}>
      {parsedValue && price && isMounted
        ? `$${formatTransactionAmount(Number(parsedValue.multiply(price.asFraction).toFixed(2)))}`
        : '$0.00'}
      {usdPctChange && (
        <span
          className={classNames(
            usdPctChange === 0
              ? ''
              : usdPctChange > 0
                ? 'text-green-600 dark:text-green'
                : usdPctChange < -5
                  ? 'text-red'
                  : usdPctChange < -3
                    ? 'text-yellow'
                    : 'text-slate-500',
          )}
        >
          {' '}
          {`${usdPctChange === 0 ? '' : usdPctChange > 0 ? '(+' : '('}${
            usdPctChange === 0 ? '0.00' : usdPctChange?.toFixed(2)
          }%)`}
        </span>
      )}
    </Typography>
  )
}
