import { type CurrencyInputProps, Web3Input } from '@zenlink-interface/compat'
import type { Amount, Type } from '@zenlink-interface/currency'
import { type FC, useMemo } from 'react'
import { formatTransactionAmount } from '@zenlink-interface/format'
import { useUsdPctChange } from 'lib/hooks'
import { useTrade } from './TradeProvider'

interface _CurrencyInputProps extends CurrencyInputProps {
  isInputType: boolean
}

function currencyAmountToPreciseFloat(currencyAmount: Amount<Type> | undefined) {
  if (!currencyAmount)
    return undefined
  const floatForLargerNumbers = Number.parseFloat(currencyAmount.toExact())
  if (floatForLargerNumbers < 0.1)
    return Number.parseFloat(currencyAmount.toSignificant(6))

  return floatForLargerNumbers
}

export const CurrencyInput: FC<_CurrencyInputProps> = ({
  className,
  value: _value,
  onChange,
  onSelect,
  currency,
  disableMaxButton,
  customTokenMap,
  tokenMap,
  onAddToken,
  onRemoveToken,
  chainId,
  disabled,
  includeNative = false,
  includeHotTokens = false,
  loading = false,
  isInputType,
}) => {
  const { trade } = useTrade()

  const [value, displayValue] = useMemo(() => {
    const value = isInputType
      ? _value
      : trade
        ? trade.outputAmount.toExact()
        : ''

    const displayValue = isInputType
      ? _value
      : trade
        ? formatTransactionAmount(currencyAmountToPreciseFloat(trade.outputAmount))
        : ''
    return [value, displayValue]
  }, [_value, isInputType, trade])

  const usdPctChange = useUsdPctChange({
    chainId,
    inputAmount: trade?.inputAmount,
    outputAmount: trade?.outputAmount,
  })

  return (
    <Web3Input.Currency
      chainId={chainId}
      className={className}
      currency={currency}
      customTokenMap={customTokenMap}
      disableMaxButton={disableMaxButton}
      disabled={disabled}
      displayValue={displayValue}
      includeHotTokens={includeHotTokens}
      includeNative={includeNative}
      loading={loading}
      onAddToken={onAddToken}
      onChange={onChange}
      onRemoveToken={onRemoveToken}
      onSelect={onSelect}
      tokenMap={tokenMap}
      usdPctChange={!isInputType ? usdPctChange : undefined}
      value={value}
    />
  )
}
