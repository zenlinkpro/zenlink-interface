import { configureStore } from '@reduxjs/toolkit'
import { tokenLists } from 'lib/state/token-lists'

import { storage, storageMiddleware } from './lib/state/storage'

export const store = configureStore({
  // @ts-expect-error ignore
  reducer: {
    [tokenLists.reducerPath]: tokenLists.reducer,
    [storage.reducerPath]: storage.reducer,
  },
  // @ts-expect-error ignore
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(storageMiddleware),
})
