import type { PayloadAction, Slice } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { DEFAULT_ACTIVE_LIST, DEFAULT_LIST_OF_LISTS } from './lists'
import type {
  AcceptPayload,
  AddPayload,
  DisablePayload,
  EnablePayload,
  FulfilledPayload,
  PendingPayload,
  RejectedPayload,
  RemovePayload,
  TokenListState,
  TokenListsState,
} from './types'

const NEW_TOKEN_LIST_STATE: TokenListState = {
  error: null,
  current: null,
  loadingTimestamp: null,
  pendingUpdate: null,
}

type Mutable<T> = { -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P] }

export const initialState: TokenListsState = {
  lastInitializedDefaultListOfLists: DEFAULT_LIST_OF_LISTS,
  byName: {
    ...DEFAULT_LIST_OF_LISTS.reduce<Mutable<TokenListsState['byName']>>((memo, listName) => {
      memo[listName] = NEW_TOKEN_LIST_STATE
      return memo
    }, {}),
  },
  activeLists: DEFAULT_ACTIVE_LIST,
}

const reducers = {
  pending: (state: TokenListsState, action: PayloadAction<PendingPayload>) => {
    const { name, timestamp } = action.payload
    const current = state.byName[name]?.current ?? null
    const pendingUpdate = state.byName[name]?.pendingUpdate ?? null
    state.byName[name] = {
      current,
      pendingUpdate,
      loadingTimestamp: timestamp,
      error: null,
    }
  },
  fulfilled: (state: TokenListsState, action: PayloadAction<FulfilledPayload>) => {
    const { name, tokenList, timestamp } = action.payload
    const current = state.byName[name]?.current
    const loadingTimestamp = state.byName[name]?.loadingTimestamp

    // no-op if update does nothing
    if (current) {
      if (timestamp === loadingTimestamp) {
        state.byName[name] = {
          current,
          pendingUpdate: tokenList,
          loadingTimestamp: null,
          error: null,
        }
      }
    }
    else {
      state.byName[name] = {
        current: tokenList,
        pendingUpdate: null,
        loadingTimestamp: null,
        error: null,
      }
    }
  },
  rejected: (state: TokenListsState, action: PayloadAction<RejectedPayload>) => {
    const { name, errorMessage, timestamp } = action.payload
    if (state.byName[name]?.loadingTimestamp !== timestamp) {
      // no-op since it's not the latest request
      return
    }

    state.byName[name] = {
      current: state.byName[name].current ? state.byName[name].current : null,
      pendingUpdate: null,
      loadingTimestamp: null,
      error: errorMessage,
    }
  },

  add: (state: TokenListsState, action: PayloadAction<AddPayload>) => {
    const name = action.payload
    if (!state.byName[name])
      state.byName[name] = NEW_TOKEN_LIST_STATE
  },

  remove: (state: TokenListsState, action: PayloadAction<RemovePayload>) => {
    const name = action.payload
    if (state.activeLists && state.activeLists.includes(name))
      state.activeLists = state.activeLists.filter(u => u !== name)
  },
  enable: (state: TokenListsState, action: PayloadAction<EnablePayload>) => {
    const name = action.payload
    if (!state.byName[name])
      state.byName[name] = NEW_TOKEN_LIST_STATE

    if (state.activeLists && !state.activeLists.includes(name))
      state.activeLists.push(name)

    if (!state.activeLists)
      state.activeLists = [name]
  },
  disabled: (state: TokenListsState, action: PayloadAction<DisablePayload>) => {
    const name = action.payload
    if (state.activeLists && state.activeLists.includes(name))
      state.activeLists = state.activeLists.filter(u => u !== name)
  },

  accept: (state: TokenListsState, action: PayloadAction<AcceptPayload>) => {
    const name = action.payload
    if (!state.byName[name]?.pendingUpdate)
      throw new Error('accept token list update called without pending update')

    state.byName[name] = {
      ...state.byName[name],
      current: state.byName[name].pendingUpdate,
      pendingUpdate: null,
    }
  },

  update: (state: TokenListsState) => {
    // state loaded from localStorage, but new lists have never been initialized
    if (!state.lastInitializedDefaultListOfLists) {
      state.byName = initialState.byName
      state.activeLists = initialState.activeLists
    }
    else if (state.lastInitializedDefaultListOfLists) {
      const lastInitializedSet = state.lastInitializedDefaultListOfLists.reduce<Set<string>>(
        (s, l) => s.add(l),
        new Set(),
      )
      const newListOfListsSet = DEFAULT_LIST_OF_LISTS.reduce<Set<string>>((s, l) => s.add(l), new Set())

      DEFAULT_LIST_OF_LISTS.forEach((listname) => {
        if (!lastInitializedSet.has(listname))
          state.byName[listname] = NEW_TOKEN_LIST_STATE
      })

      state.lastInitializedDefaultListOfLists.forEach((listname) => {
        if (!newListOfListsSet.has(listname))
          delete state.byName[listname]
      })
    }

    state.lastInitializedDefaultListOfLists = DEFAULT_LIST_OF_LISTS

    // if no active lists, activate defaults
    if (!state.activeLists) {
      state.activeLists = DEFAULT_ACTIVE_LIST

      // for each list on default list, initialize if needed
      DEFAULT_ACTIVE_LIST.map((listname: string) => {
        if (!state.byName[listname])
          state.byName[listname] = NEW_TOKEN_LIST_STATE

        return true
      })
    }
  },
}

export function createTokenListsSlice(reducerPath: string): Slice<TokenListsState> {
  return createSlice({
    name: reducerPath,
    initialState,
    reducers,
  })
}

export type TokenListsActions = ReturnType<typeof createTokenListsSlice>['actions']
