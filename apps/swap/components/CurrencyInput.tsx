import { TradeType } from '@zenlink-interface/amm'
import type { CurrencyInputProps } from '@zenlink-interface/wagmi'
import { Web3Input } from '@zenlink-interface/wagmi'
import type { FC } from 'react'
import { useTrade } from './TradeProvider'

interface _CurrencyInputProps extends CurrencyInputProps {
  inputType: TradeType
  tradeType: TradeType
  isWrap?: boolean
}

export const CurrencyInput: FC<_CurrencyInputProps> = ({
  className,
  value: _value,
  onChange,
  onSelect,
  currency,
  customTokenMap,
  tokenMap,
  onAddToken,
  onRemoveToken,
  chainId,
  inputType,
  tradeType,
  disabled,
  loading = false,
  isWrap = false,
}) => {
  const { trade } = useTrade()
  // If output field and (un)wrapping, set to _value
  let value = inputType === tradeType
    ? _value
    : trade
      ? trade?.outputAmount?.toExact()
      : ''
  value = inputType === TradeType.EXACT_OUTPUT && isWrap ? _value : value

  return (
    <Web3Input.Currency
      className={className}
      value={value}
      onChange={onChange}
      currency={currency}
      onSelect={onSelect}
      customTokenMap={customTokenMap}
      onAddToken={onAddToken}
      onRemoveToken={onRemoveToken}
      chainId={chainId}
      tokenMap={tokenMap}
      loading={loading}
      disabled={disabled}
    />
  )
}
