export function wrapResultData<T>(data: T, error: boolean): { data: T | undefined; error: boolean } {
  return { data: data || undefined, error: data ? false : error }
}

export * from './daySnapshots'
export * from './pairs'
export * from './stableSwaps'
export * from './tokenPrices'
export * from './tokens'
export * from './txStatus'
export * from './userPools'
export * from './zenlinkInfos'
