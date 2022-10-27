import type { FC } from 'react'

import type { CurrencyInputProps } from './Currency'
import { CurrencyInput } from './Currency'

interface Web3InputInterface {
  Currency: FC<CurrencyInputProps>
}

export const Web3Input: Web3InputInterface = {
  Currency: CurrencyInput,
}
