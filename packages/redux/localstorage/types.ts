import type { ParachainId } from '@zenlink-interface/chain'

export interface WithStorageState {
  [path: string]: StorageState
}

export enum GasPrice {
  INSTANT = 'Instant',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export interface TokenAsObject {
  address: string
  chainId: ParachainId
  symbol?: string
  name?: string
  decimals: number
}

export interface StorageState {
  carbonOffset: boolean
  slippageTolerance: number
  slippageToleranceType: 'auto' | 'custom'
  gasPrice: GasPrice
  maxFeePerGas: number | undefined
  maxPriorityFeePerGas: number | undefined
  gasType: 'custom' | 'preset'
  customTokens: Record<number, Record<string, TokenAsObject>>
  transactionDeadline: number
  notifications: Record<string, Record<string, string[]>>
  parachainId: ParachainId
}

export interface UpdateCarbonOffsetPayload {
  carbonOffset: boolean
}

export interface UpdateSlippageTolerancePayload {
  slippageTolerance: number
}

export interface UpdateSlippageToleranceTypePayload {
  slippageToleranceType: 'auto' | 'custom'
}

export interface UpdateGasPrice {
  gasPrice: GasPrice
}

export interface UpdateMaxPriorityFeePerGas {
  maxPriorityFeePerGas: number | undefined
}

export interface UpdateMaxFeePerGas {
  maxFeePerGas: number | undefined
}

export interface UpdateGasType {
  gasType: 'custom' | 'preset'
}

export interface UpdateTransactionDeadline {
  transactionDeadline: number
}

export interface createNotification {
  account: string
  notification: string
  timestamp: number
}

export interface ClearNotifications {
  account: string
}

export interface UpdateParachainId {
  parachainId: ParachainId
}

export type AddCustomToken = TokenAsObject
export type AddCustomTokens = TokenAsObject[]
export type RemoveCustomToken = Pick<TokenAsObject, 'chainId' | 'address'>

