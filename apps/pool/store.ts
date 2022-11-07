import { configureStore } from '@reduxjs/toolkit'
import { storage, storageMiddleware } from 'lib/state/storage'
import { tokenLists } from 'lib/state/token-lists'

export const store = configureStore({
  reducer: {
    [tokenLists.reducerPath]: tokenLists.reducer,
    [storage.reducerPath]: storage.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(storageMiddleware),
})
