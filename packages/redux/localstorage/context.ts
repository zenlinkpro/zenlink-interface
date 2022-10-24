import type { StorageActions } from './slice'

export interface StorageContext {
  reducerPath: string
  actions: StorageActions
}
