import type { PayloadAction, Slice } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { ParachainId } from '@zenlink-interface/chain'
import type {
  AddCustomToken,
  AddCustomTokens,
  ClearNotifications,
  RemoveCustomToken,
  StorageState,
  UpdateAggregatorPayload,
  UpdateGasPrice,
  UpdateGasType,
  UpdateMaxFeePerGas,
  UpdateMaxPriorityFeePerGas,
  UpdateParachainId,
  UpdatePolkadotAddress,
  UpdatePolkadotConnector,
  UpdateSlippageTolerancePayload,
  UpdateSlippageToleranceTypePayload,
  UpdateTransactionDeadline,
  UpdateUserLocale,
  createNotification,
} from './types'
import { GasPrice } from './types'

const parsedState = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userPreferences') || '{}') : {}
const initialState: StorageState = {
  aggregator: parsedState?.aggregator || true,
  slippageTolerance: parsedState?.slippageTolerance || 0.5,
  slippageToleranceType: parsedState?.slippageToleranceType || 'auto',
  gasPrice: parsedState?.gasPrice || GasPrice.HIGH,
  maxFeePerGas: parsedState?.maxFeePerGas || undefined,
  maxPriorityFeePerGas: parsedState?.maxPriorityFeePerGas || undefined,
  gasType: parsedState?.gasType || 'preset',
  customTokens: parsedState?.customTokens || {},
  transactionDeadline: 30,
  notifications: parsedState?.notifications || {},
  parachainId: parsedState?.parachainId || ParachainId.CALAMARI_KUSAMA,
  polkadotConnector: parsedState?.polkadotConnector || undefined,
  polkadotAddress: parsedState?.polkadotAddress || undefined,
  userLocale: parsedState?.userLocale || 'en-US',
}

const reducers = {
  updateAggregator: (state: StorageState, action: PayloadAction<UpdateAggregatorPayload>) => {
    const { aggregator } = action.payload
    state.aggregator = aggregator
  },
  updateSlippageTolerance: (state: StorageState, action: PayloadAction<UpdateSlippageTolerancePayload>) => {
    const { slippageTolerance } = action.payload
    state.slippageTolerance = slippageTolerance
  },
  updateSlippageToleranceType: (state: StorageState, action: PayloadAction<UpdateSlippageToleranceTypePayload>) => {
    const { slippageToleranceType } = action.payload
    state.slippageToleranceType = slippageToleranceType
  },
  updateGasPrice: (state: StorageState, action: PayloadAction<UpdateGasPrice>) => {
    const { gasPrice } = action.payload
    state.gasPrice = gasPrice
    state.gasType = 'preset'
  },
  updateMaxFeePerGas: (state: StorageState, action: PayloadAction<UpdateMaxFeePerGas>) => {
    const { maxFeePerGas } = action.payload
    state.maxFeePerGas = maxFeePerGas
    if (state.maxPriorityFeePerGas)
      state.gasType = 'custom'
  },
  updateMaxPriorityFeePerGas: (state: StorageState, action: PayloadAction<UpdateMaxPriorityFeePerGas>) => {
    const { maxPriorityFeePerGas } = action.payload
    state.maxPriorityFeePerGas = maxPriorityFeePerGas
    if (state.maxFeePerGas)
      state.gasType = 'custom'
  },
  updateGasType: (state: StorageState, action: PayloadAction<UpdateGasType>) => {
    const { gasType } = action.payload
    state.gasType = gasType
  },
  addCustomToken: (state: StorageState, action: PayloadAction<AddCustomToken>) => {
    const { address, symbol, name, chainId, decimals } = action.payload

    if (!state.customTokens[chainId])
      state.customTokens[chainId] = {}

    state.customTokens[chainId][address.toLowerCase()] = { address, symbol, name, chainId, decimals }
  },
  addCustomTokens: (state: StorageState, action: PayloadAction<AddCustomTokens>) => {
    for (const item of action.payload) {
      const { address, symbol, name, chainId, decimals } = item

      if (!state.customTokens[chainId])
        state.customTokens[chainId] = {}

      state.customTokens[chainId][address.toLowerCase()] = { address, symbol, name, chainId, decimals }
    }
  },
  removeCustomToken: (state: StorageState, action: PayloadAction<RemoveCustomToken>) => {
    const { address, chainId } = action.payload

    if (state.customTokens[chainId] && state.customTokens[chainId][address.toLowerCase()])
      delete state.customTokens[chainId][address.toLowerCase()]
  },
  updateTransactionDeadline: (state: StorageState, action: PayloadAction<UpdateTransactionDeadline>) => {
    const { transactionDeadline } = action.payload
    state.transactionDeadline = transactionDeadline
  },
  createNotification: (state: StorageState, action: PayloadAction<createNotification>) => {
    const { notification, account, timestamp } = action.payload
    if (!state.notifications[account])
      state.notifications[account] = {}

    if (!state.notifications[account][timestamp])
      state.notifications[account][timestamp] = [notification]

    else
      state.notifications[account][timestamp].push(notification)
  },
  clearNotifications: (state: StorageState, action: PayloadAction<ClearNotifications>) => {
    const { account } = action.payload
    const address = Object.entries(state.notifications).find(
      ([address]) => address.toLowerCase() === account.toLowerCase(),
    )?.[0]
    if (address)
      delete state.notifications[address]
  },
  updateParachainId: (state: StorageState, action: PayloadAction<UpdateParachainId>) => {
    const { parachainId } = action.payload
    state.parachainId = parachainId
  },
  updatePolkadotConnector: (state: StorageState, action: PayloadAction<UpdatePolkadotConnector>) => {
    const { polkadotConnector } = action.payload
    state.polkadotConnector = polkadotConnector
  },
  updatePolkadotAddress: (state: StorageState, action: PayloadAction<UpdatePolkadotAddress>) => {
    const { polkadotAddress } = action.payload
    state.polkadotAddress = polkadotAddress
  },
  updateUserLocale: (state: StorageState, action: PayloadAction<UpdateUserLocale>) => {
    const { userLocale } = action.payload
    state.userLocale = userLocale
  },
}

export function createStorageSlice(reducerPath: string): Slice<StorageState> {
  return createSlice<StorageState, typeof reducers>({
    name: reducerPath,
    initialState,
    reducers,
  })
}

export type StorageActions = ReturnType<typeof createStorageSlice>['actions']
