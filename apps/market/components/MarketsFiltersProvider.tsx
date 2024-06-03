import type { MarketGraphData } from '@zenlink-interface/graph-client'
import type { FC, ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import useSWR from 'swr'

enum Filters {
  activeOnly = 'activeOnly',
}

interface FilterContextProps {
  query: string
  extraQuery: string
  [Filters.activeOnly]: boolean
  setFilters: (filters: Partial<Omit<FilterContextProps, 'setFilters'>>) => void
  marketsGraphDataMap: Record<string, MarketGraphData>
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined)

interface MarketsFiltersProviderProps {
  children?: ReactNode
}

export const MarketsFiltersProvider: FC<MarketsFiltersProviderProps> = ({ children }) => {
  const [filters, _setFilters] = useState({
    query: '',
    extraQuery: '',
    [Filters.activeOnly]: false,
  })

  const setFilters = useCallback((filters: Partial<Omit<FilterContextProps, 'setFilters'>>) => {
    _setFilters(prevState => ({
      ...prevState,
      ...filters,
    }))
  }, [])

  const { data: marketsGraphData } = useSWR<MarketGraphData[]>(
    '/market/api/markets',
    (url: string) => fetch(url).then(response => response.json()),
  )

  const marketsGraphDataMap = useMemo(() => {
    if (!marketsGraphData)
      return {}

    return marketsGraphData.reduce((map, data) => ({
      ...map,
      [data.address]: data,
    }), {})
  }, [marketsGraphData])

  return (
    <FilterContext.Provider
      value={{
        ...filters,
        setFilters,
        marketsGraphDataMap,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useMarketFilters() {
  const context = useContext(FilterContext)
  if (!context)
    throw new Error('Hook can only be used inside Filter Context')

  return context
}
