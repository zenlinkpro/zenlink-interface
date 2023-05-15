/* eslint-disable no-console */
import type { ParachainId } from '@zenlink-interface/chain'
import { useInterval, useIsWindowVisible } from '@zenlink-interface/hooks'
import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { PublicClient } from '@wagmi/core'
import type { TokenListsContext } from './context'
import { useAllLists, useFetchListCallback } from './hooks'

export interface UpdaterProps {
  context: TokenListsContext
  chainId: ParachainId // For now, one updater is required for each chainId to be watched
  provider: PublicClient
  isDebug?: boolean
}

function Updater(props: UpdaterProps): null {
  const { context, provider } = props
  const { actions } = context
  const dispatch = useDispatch()
  const fetchList = useFetchListCallback(context)

  const isWindowVisible = useIsWindowVisible()

  // get all loaded lists, and the active urls
  const lists = useAllLists(context)

  const fetchAllListsCallback = useCallback(() => {
    if (!isWindowVisible)
      return
    Object.keys(lists).forEach(url =>
      fetchList(url).catch(error => console.debug('interval list fetching error', error)),
    )
  }, [fetchList, isWindowVisible, lists])

  // fetch all lists every 10 minutes, but only after we initialize library
  useInterval(fetchAllListsCallback, provider ? 1000 * 60 * 10 : null)

  // whenever a list is not loaded and not loading, try again to load it
  useEffect(() => {
    Object.keys(lists).forEach((listName) => {
      const list = lists[listName]
      if (!list.current && !list.loadingTimestamp && !list.error)
        fetchList(listName).catch(error => console.debug('list added fetching error', error))
    })
  }, [fetchList, lists])

  // automatically update lists if versions are minor/patch
  useEffect(() => {
    Object.keys(lists).forEach((listName) => {
      const list = lists[listName]
      if (list.current && list.pendingUpdate)
        dispatch(actions.accept(listName))
    })
  }, [actions, dispatch, lists])

  return null
}

export function createUpdater(context: TokenListsContext) {
  const UpdaterContextBound = (props: Omit<UpdaterProps, 'context'>) => {
    return <Updater context={context} {...props} />
  }
  return UpdaterContextBound
}
