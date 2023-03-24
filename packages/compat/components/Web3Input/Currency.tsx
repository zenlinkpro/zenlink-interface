import { ChevronDownIcon } from '@heroicons/react/20/solid'
import type { Type } from '@zenlink-interface/currency'
import { tryParseAmount } from '@zenlink-interface/currency'
import { useIsMounted } from '@zenlink-interface/hooks'
import { usePrices } from '@zenlink-interface/shared'
import {
  DEFAULT_INPUT_UNSTYLED,
  Input,
  Skeleton,
  Typography,
  Currency as UICurrency,
  classNames,
} from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useAccount, useBalance } from '../../hooks'
import type { TokenSelectorProps } from '../TokenSelector'
import { TokenSelector } from '../TokenSelector'

export interface CurrencyInputProps
  extends Pick<
    TokenSelectorProps,
    'onAddToken' | 'onRemoveToken' | 'onSelect' | 'tokenMap' | 'chainId' | 'customTokenMap'
  > {
  value: string
  disabled?: boolean
  onChange(value: string): void
  currency: Type | undefined
  usdPctChange?: number
  disableMaxButton?: boolean
  className?: string
  loading?: boolean
  includeNative?: boolean
}

export const CurrencyInput: FC<CurrencyInputProps> = ({
  disabled,
  value,
  onChange,
  currency,
  onSelect,
  onAddToken,
  onRemoveToken,
  chainId,
  tokenMap,
  customTokenMap,
  disableMaxButton = false,
  usdPctChange,
  className,
  includeNative = true,
  loading,
}) => {
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const inputRef = useRef<HTMLInputElement>(null)
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState(false)

  const focusInput = useCallback(() => {
    if (disabled)
      return
    inputRef.current?.focus()
  }, [disabled])

  const handleClose = useCallback(() => {
    setTokenSelectorOpen(false)
  }, [])

  return useMemo(
    () => (
      <div className={className} onClick={focusInput}>
        <div className="relative flex items-center gap-1">
          {loading && isMounted
            ? (
            <div className="flex flex-col gap-1 justify-center flex-grow h-[44px]">
              <Skeleton.Box className="w-[120px] h-[22px] bg-black/[0.12] dark:bg-white/[0.06] rounded-full" />
            </div>
              )
            : (
            <Input.Numeric
              ref={inputRef}
              variant="unstyled"
              disabled={disabled}
              onUserInput={onChange}
              className={classNames(DEFAULT_INPUT_UNSTYLED, '!text-3xl py-1 text:black dark:text-slate-200')}
              value={value}
              readOnly={disabled}
            />
              )}
          <button
            {...(onSelect && {
              onClick: (e) => {
                setTokenSelectorOpen(true)
                e.stopPropagation()
              },
            })}
            className={classNames(
              onSelect ? 'shadow-md hover:ring-2' : 'cursor-default text-2xl',
              currency || loading ? 'ring-slate-300 dark:ring-slate-500' : '',
              'h-[36px] text:black dark:text-slate-200 bg-black/[0.06] dark:bg-white/[0.06] transition-all flex flex-row items-center gap-1 text-xl font-semibold rounded-full px-2 py-1',
            )}
          >
            {loading && !currency
              ? (
              <div className="flex gap-1">
                <Skeleton.Circle radius={20} className=" bg-black/[0.12] dark:bg-white/[0.06]" />
                <Skeleton.Box className="w-[60px] h-[20px] bg-black/[0.12] dark:bg-white/[0.06]" />
              </div>
                )
              : currency
                ? (
              <>
                <div className="w-5 h-5">
                  <UICurrency.Icon
                    disableLink
                    layout="responsive"
                    currency={currency}
                    width={20}
                    height={20}
                    priority
                  />
                </div>
                <div className="ml-0.5 -mr-0.5">{currency.symbol}</div>
              </>
                  )
                : (
              <div className="ml-0.5 -mr-0.5 pl-1">Select</div>
                  )}
            {onSelect && (
              <div className="w-5 h-5">
                <ChevronDownIcon width={20} height={20} />
              </div>
            )}
          </button>
        </div>
        <div className="flex flex-row justify-between h-[24px]">
          <PricePanel value={value} currency={currency} usdPctChange={usdPctChange} />
          <div className="h-6">
            <BalancePanel
              chainId={chainId}
              loading={loading}
              account={address}
              onChange={onChange}
              currency={currency}
              disableMaxButton={disableMaxButton}
            />
          </div>
        </div>
        {onSelect && (
          <TokenSelector
            variant="dialog"
            onClose={handleClose}
            open={tokenSelectorOpen}
            chainId={chainId}
            currency={currency}
            onSelect={onSelect}
            onAddToken={onAddToken}
            onRemoveToken={onRemoveToken}
            tokenMap={tokenMap}
            customTokenMap={customTokenMap}
            includeNative={includeNative}
          />
        )}
      </div>
    ),
    [
      address,
      chainId,
      className,
      currency,
      customTokenMap,
      disableMaxButton,
      disabled,
      focusInput,
      handleClose,
      includeNative,
      isMounted,
      loading,
      onAddToken,
      onChange,
      onRemoveToken,
      onSelect,
      tokenMap,
      tokenSelectorOpen,
      usdPctChange,
      value,
    ],
  )
}

type BalancePanelProps = Pick<
  CurrencyInputProps,
  'chainId' | 'onChange' | 'currency' | 'disableMaxButton' | 'loading'
> & {
  account: string | undefined
}

const BalancePanel: FC<BalancePanelProps> = ({
  chainId,
  account,
  onChange,
  currency,
  loading,
  disableMaxButton,
}) => {
  const isMounted = useIsMounted()
  const { data: balance, isLoading } = useBalance({
    chainId,
    currency,
    account,
    enabled: Boolean(currency),
  })

  if ((isLoading || loading) && isMounted) {
    return (
      <div className="h-[24px] w-[60px] flex items-center">
        <Skeleton.Box className="bg-black/[0.12] dark:bg-white/[0.06] h-[12px] w-full" />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onChange(balance?.greaterThan(0) ? balance.toFixed() : '')}
      className="py-1 text-xs text-slate-700 dark:text-slate-400 hover:text-slate-600 hover:dark:text-slate-300"
      disabled={disableMaxButton}
    >
      {isMounted && balance ? `Balance: ${balance?.toSignificant(6)}` : 'Balance: 0'}
    </button>
  )
}

type PricePanelProps = Pick<CurrencyInputProps, 'currency' | 'value' | 'usdPctChange'>
const PricePanel: FC<PricePanelProps> = ({ currency, usdPctChange, value }) => {
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
    <Typography variant="xs" weight={400} className="py-1 select-none text-slate-700 dark:text-slate-400">
      {parsedValue && price && isMounted ? `$${parsedValue.multiply(price.asFraction).toFixed(2)}` : '$0.00'}
      {usdPctChange && (
        <span
          className={classNames(
            usdPctChange === 0
              ? ''
              : usdPctChange > 0
                ? 'text-green'
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
