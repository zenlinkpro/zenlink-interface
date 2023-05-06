import type { Type } from '@zenlink-interface/currency'
import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { Currency as UICurrency, classNames } from '@zenlink-interface/ui'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Trans } from '@lingui/macro'
import { TokenSelector } from './TokenSelector/TokenSelector'
import type { TokenSelectorProps } from './TokenSelector/TokenSelector'

export interface CurrencyInputProps extends Pick<TokenSelectorProps, 'onSelect' | 'tokenMap'> {
  value: string
  onChange(value: string): void
  className?: string
  currency?: Type | undefined
}

export const CurrencyInput: FC<CurrencyInputProps> = ({
  onSelect,
  currency,
  tokenMap,
}) => {
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false)
  const handleClose = useCallback(() => {
    setTokenSelectorOpen(false)
  }, [])

  return (
    <>
      <div>
        <button
          {...(onSelect && {
            onClick: (e) => {
              setTokenSelectorOpen(true)
              e.stopPropagation()
            },
          })}
          className={classNames(
            onSelect ? 'shadow-sm hover:ring-2' : 'cursor-default text-2xl',
            currency ? 'ring-slate-300 dark:ring-slate-500' : '!bg-blue-500 !text-slate-200 ring-blue-700',
            'h-[36px] text:black dark:text-slate-200 bg-black/[0.06] dark:bg-white/[0.06] transition-all flex flex-row items-center gap-1 text-xl font-semibold rounded-full px-2 py-1',
          )}
        >
          {currency
            ? (
              <>
                <div className="w-6 h-6">
                  <UICurrency.Icon
                    disableLink
                    layout="responsive"
                    currency={currency}
                    width={24}
                    height={24}
                    priority
                  />
                </div>
                <div className="ml-0.5 -mr-0.5">{currency.symbol}</div>
              </>
              )
            : (
              <div className="ml-0.5 -mr-0.5 pl-1">
                <Trans>Select</Trans>
              </div>
              )}
          {onSelect && (
            <div className="w-5 h-5">
              <ChevronDownIcon width={20} height={20} />
            </div>
          )}
        </button>
      </div>
      {onSelect && (
        <TokenSelector
          tokenMap={tokenMap}
          variant="dialog"
          onClose={handleClose}
          open={tokenSelectorOpen}
          currency={currency}
          onSelect={onSelect}
        />
      )}
    </>
  )
}
