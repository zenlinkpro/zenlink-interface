import { GenericTable, useBreakpoint } from '@zenlink-interface/ui'
import { useMarketFilters } from 'components/MarketsFiltersProvider'
import { type FC, useCallback, useEffect, useState } from 'react'
import { type SortingState, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import type { Market } from '@zenlink-interface/market'
import { PAGE_SIZE } from '../constants'
import {
  FIXED_APY_COLUMN,
  IMPLIED_APY_COLUMN,
  LIQUIDITY_COLUMN,
  LONG_YIELD_APY_COLUMN,
  MATURITY_COLUMN,
  NAME_COLUMN,
  UNDERLYING_APY_COLUMN,
} from './Cells/columns'

const COLUMNS = [
  NAME_COLUMN,
  MATURITY_COLUMN,
  LIQUIDITY_COLUMN,
  UNDERLYING_APY_COLUMN,
  IMPLIED_APY_COLUMN,
  LONG_YIELD_APY_COLUMN,
  FIXED_APY_COLUMN,
]

interface MarketsTableParams {
  markets: Market[] | undefined
  isLoading: boolean
}

export const MarketsTable: FC<MarketsTableParams> = ({ markets, isLoading }) => {
  const { query, extraQuery, activeOnly } = useMarketFilters()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})

  const table = useReactTable<Market>({
    data: markets || [],
    columns: COLUMNS,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
  })

  useEffect(() => {
    if (isSm && !isMd) {
      setColumnVisibility({
        impliedAPY: false,
        longYieldAPY: false,
        fixedAPY: false,
      })
    }
    else if (isSm) {
      setColumnVisibility({})
    }
    else {
      setColumnVisibility({
        underlyingAPY: false,
        impliedAPY: false,
        longYieldAPY: false,
        fixedAPY: false,
      })
    }
  }, [isMd, isSm])

  const rowLink = useCallback((row: Market) => {
    return `/${row.address}`
  }, [])

  return (
    <>
      <GenericTable<Market>
        linkFormatter={rowLink}
        loading={isLoading}
        pageSize={PAGE_SIZE}
        placeholder="No markets found"
        table={table}
        tdClassName="h-[68px]"
      />
    </>
  )
}
