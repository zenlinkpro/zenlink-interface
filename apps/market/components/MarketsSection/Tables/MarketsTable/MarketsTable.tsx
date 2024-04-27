import { GenericTable, useBreakpoint } from '@zenlink-interface/ui'
import { useMarketFilters } from 'components/MarketsFiltersProvider'
import { type FC, useCallback, useEffect, useState } from 'react'
import { type SortingState, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useMarkets } from '@zenlink-interface/wagmi'
import { ParachainId } from '@zenlink-interface/chain'
import type { Market } from '@zenlink-interface/market'
import { PAGE_SIZE } from '../constants'
import { MATURITY_COLUMN, NAME_COLUMN, TVL_COLUMN } from './Cells/columns'

const COLUMNS = [NAME_COLUMN, MATURITY_COLUMN, TVL_COLUMN]

export const MarketsTable: FC = () => {
  const { query, extraQuery, activeOnly } = useMarketFilters()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})

  const { data: markets, isLoading } = useMarkets(ParachainId.MOONBEAM)

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
        volume: false,
        network: false,
        fees: false,
      })
    }
    else if (isSm) {
      setColumnVisibility({})
    }
    else {
      setColumnVisibility({
        volume: false,
        network: false,
        fees: false,
        apr: false,
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
        placeholder="No pools found"
        table={table}
      />
    </>
  )
}
