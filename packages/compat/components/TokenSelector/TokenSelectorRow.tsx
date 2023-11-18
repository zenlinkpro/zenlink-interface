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
          `group flex items-center w-full hover:bg-blue-500/50 px-4 h-[56px] token-${currency?.symbol}`,
        )}
        onClick={onClick}
        style={style}
      >
        <div className="flex items-center justify-between flex-grow gap-2 rounded cursor-pointer">
          <div className="flex flex-row items-center flex-grow gap-3">
            <div className="w-9 h-9">
              <Currency.Icon currency={currency} height={36} priority={inViewport} width={36} />
            </div>
            <div className="flex flex-col items-start">
              <Typography className="text-slate-800 dark:text-slate-200 group-hover:text-slate-50" variant="base" weight={600}>
                {currency.symbol}
              </Typography>
              <Typography className="text-slate-500 group-hover:text-blue-100" variant="xs">
                {currency.name}
              </Typography>
            </div>
          </div>

          {balance && balance.greaterThan(ZERO) && (
            <div className="flex flex-col">
              <Typography className="text-right text-slate-800 dark:text-slate-200" variant="base" weight={600}>
                {balance.toSignificant(6)}
              </Typography>
              <Typography className="text-right text-slate-500" variant="xs">
                {price ? `$${balance.multiply(price).toFixed(2)}` : '-'}
              </Typography>
            </div>
          )}
        </div>
      </div>
    )
  },
)
