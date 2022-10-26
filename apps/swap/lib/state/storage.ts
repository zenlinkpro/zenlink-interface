import { createStorage } from '@zenlink-interface/redux-localstorage'

// Create a multicall instance with default settings
export const storage: ReturnType<typeof createStorage> = createStorage()

export const { useSettings, useCustomTokens, useAllCustomTokens } = storage.hooks
export const { storageMiddleware } = storage.middleware
