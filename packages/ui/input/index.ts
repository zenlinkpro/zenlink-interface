import type { FC } from 'react'
import type { ForwardRefWithAttributes } from '../types'
import type { AddressProps } from './Address'

import type { CounterProps } from './Counter'
import type { DatetimeLocalProps } from './DatetimeLocal'
import type { NumericProps } from './Numeric'
import type { PercentProps } from './Percent'
import type { SearchProps } from './Search'
import classNames from 'classnames'
import { Address } from './Address'
import { Counter } from './Counter'
import { DatetimeLocal } from './DatetimeLocal'
import { Input as Numeric } from './Numeric'
import { Input as Percent } from './Percent'
import { Search } from './Search'

// Base classes
export const DEFAULT_INPUT_FONT = 'text-gray-900 dark:text-slate-50 text-left text-base md:text-sm placeholder:font-normal font-medium placeholder:30'
export const DEFAULT_INPUT_BG = 'bg-slate-200 dark:bg-white/[0.06]'
export const DEFAULT_INPUT_HOVER_BG = 'hover:bg-white hover:bg-opacity-[0.06]'
export const DEFAULT_INPUT_RING
  = 'focus-within:ring-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus-within:ring-offset-2 ring-blue focus:ring-blue focus-within:ring-blue'
export const DEFAULT_INPUT_PADDING = 'py-3 px-4'
export const ERROR_INPUT_CLASSNAME = '!ring-red/70 !ring-2 !ring-offset-2'
export const DEFAULT_INPUT_APPEARANCE = 'rounded-xl shadow-sm min-h-[44px] w-full truncate'
export const DEFAULT_INPUT_NO_RINGS = 'border-none focus:outline-none focus:ring-0'

// Unstyled input
export const DEFAULT_INPUT_UNSTYLED = classNames(
  DEFAULT_INPUT_FONT,
  'p-0 bg-transparent border-none focus:outline-none focus:ring-0 w-full truncate font-medium',
)

// Default class without padding
export const DEFAULT_INPUT_CLASSNAME_NO_PADDING = classNames(
  DEFAULT_INPUT_FONT,
  DEFAULT_INPUT_BG,
  DEFAULT_INPUT_RING,
  DEFAULT_INPUT_APPEARANCE,
)

// Default class with padding
export const DEFAULT_INPUT_CLASSNAME = classNames(
  DEFAULT_INPUT_FONT,
  DEFAULT_INPUT_BG,
  DEFAULT_INPUT_RING,
  DEFAULT_INPUT_APPEARANCE,
  DEFAULT_INPUT_PADDING,
)

export const Input: {
  Address: ForwardRefWithAttributes<HTMLInputElement, AddressProps>
  DatetimeLocal: FC<DatetimeLocalProps>
  Counter: FC<CounterProps>
  Numeric: ForwardRefWithAttributes<HTMLInputElement, NumericProps>
  Percent: ForwardRefWithAttributes<HTMLInputElement, PercentProps>
  Search: FC<SearchProps>
} = { Address, DatetimeLocal, Counter, Numeric, Percent, Search }
