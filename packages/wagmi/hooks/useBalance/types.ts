import type { Amount, Type } from '@zenlink-interface/currency'

export type BalanceMap = Record<string, Amount<Type> | undefined> | undefined
