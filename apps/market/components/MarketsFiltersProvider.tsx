import type { FC, ReactNode } from 'react'
import { createContext, useCallback, useContext, useState } from 'react'

enum Filters {
  activeOnly = 'activeOnly',
}

interface FilterContextProps {
  query: string
  extraQuery: string
  [Filters.activeOnly]: boolean
  setFilters: (filters: Partial<Omit<FilterContextProps, 'setFilters'>>) => void
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

  return (
    <FilterContext.Provider
      value={{
        ...filters,
        setFilters,
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
