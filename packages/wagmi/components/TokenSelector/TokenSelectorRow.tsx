import type { Amount, Type } from '@zenlink-interface/currency'
import { useInViewport } from '@zenlink-interface/hooks'
import type { Fraction } from '@zenlink-interface/math'
import { ZERO } from '@zenlink-interface/math'
import { Currency, Typography, classNames } from '@zenlink-interface/ui'
import type { CSSProperties, FC } from 'react'
import { memo, useCallback, useRef } from 'react'

interface TokenSelectorRowProps {
  account?: string
  currency: Type
  style?: CSSProperties
  className?: string
  onCurrency(currency: Type): void
  balance?: Amount<Type>
  price?: Fraction
}

export const TokenSelectorRow: FC<TokenSelectorRowProps> = memo(
  ({ price, balance, currency, style, className, onCurrency }: TokenSelectorRowProps) => {
    const onClick = useCallback(() => {
      onCurrency(currency)
    }, [currency, onCurrency])
    const ref = useRef<HTMLDivElement>(null)
    const inViewport = useInViewport(ref)
    return (
      <div
        className={classNames(
          className,
          `group flex items-center w-full hover:bg-black/[0.06] hover:dark:bg-white/[0.06] px-4 h-[48px] token-${currency?.symbol}`,
        )}
        onClick={onClick}
        style={style}
      >
        <div className="flex items-center justify-between flex-grow gap-2 rounded cursor-pointer">
          <div className="flex flex-row items-center flex-grow gap-3">
            <div className="w-7 h-7">
              <Currency.Icon currency={currency} height={28} priority={inViewport} width={28} />
            </div>
            <div className="flex flex-col items-start">
              <Typography className="text-gray-700 group-hover:text-gray-900 dark:text-slate-200 group-hover:dark:text-slate-50" variant="sm" weight={600}>
                {currency.symbol}
              </Typography>
              <Typography className="text-gray-600 dark:text-slate-500 group-hover:dark:text-blue-100" variant="xs">
                {currency.name}
              </Typography>
            </div>
          </div>

          {balance && balance.greaterThan(ZERO) && (
            <div className="flex flex-col">
              <Typography className="text-right text-gray-700 dark:text-slate-200" variant="sm" weight={600}>
                {balance.toSignificant(6)}
              </Typography>
              <Typography className="text-right text-gray-500 dark:text-slate-400" variant="xs">
                {price ? `$${balance.multiply(price).toFixed(2)}` : '-'}
              </Typography>
            </div>
          )}
        </div>
      </div>
    )
  },
)
