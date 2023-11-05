import type { ParachainId } from '@zenlink-interface/chain'
import type { FC, ReactNode } from 'react'
import { createContext, useCallback, useContext, useState } from 'react'
import { AVAILABLE_POOL_TYPE_MAP } from 'lib/constants'
import { SUPPORTED_CHAIN_IDS } from 'config'

enum Filters {
  myTokensOnly = 'myTokensOnly',
  singleSidedStakingOnly = 'singleSidedStakingOnly',
  stablePairsOnly = 'stablePairsOnly',
  selectedNetworks = 'selectedNetworks',
  selectedPoolTypes = 'selectedPoolTypes',
  incentivizedOnly = 'incentivizedOnly',
}

interface FilterContextProps {
  query: string
  extraQuery: string
  [Filters.myTokensOnly]: boolean
  [Filters.singleSidedStakingOnly]: boolean
  [Filters.stablePairsOnly]: boolean
  [Filters.selectedNetworks]: ParachainId[]
  [Filters.selectedPoolTypes]: string[]
  [Filters.incentivizedOnly]: boolean
  atLeastOneFilterSelected: boolean
  setFilters(filters: Partial<Omit<FilterContextProps, 'setFilters'>>): void
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined)

interface PoolsFiltersProviderProps {
  children?: ReactNode
}

export const PoolsFiltersProvider: FC<PoolsFiltersProviderProps> = ({
  children,
}) => {
  const [filters, _setFilters] = useState({
    query: '',
    extraQuery: '',
    [Filters.myTokensOnly]: false,
    [Filters.singleSidedStakingOnly]: false,
    [Filters.stablePairsOnly]: false,
    [Filters.selectedNetworks]: SUPPORTED_CHAIN_IDS,
    [Filters.selectedPoolTypes]: Object.keys(AVAILABLE_POOL_TYPE_MAP),
    [Filters.incentivizedOnly]: false,
    atLeastOneFilterSelected: false,
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
        atLeastOneFilterSelected:
          filters.query.length > 0
          || filters.selectedPoolTypes.length !== Object.keys(AVAILABLE_POOL_TYPE_MAP).length,
        setFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function usePoolFilters() {
  const context = useContext(FilterContext)
  if (!context)
    throw new Error('Hook can only be used inside Filter Context')

  return context
}
