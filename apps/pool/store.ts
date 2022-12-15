import { configureStore } from '@reduxjs/toolkit'
import { storage, storageMiddleware } from 'lib/state/storage'
import { tokenLists } from 'lib/state/token-lists'

export const store = configureStore({
  // @ts-expect-error ignore
  reducer: {
    [tokenLists.reducerPath]: tokenLists.reducer,
    [storage.reducerPath]: storage.reducer,
  },
  // @ts-expect-error ignore
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(storageMiddleware),
})
