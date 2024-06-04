import type { SortingState } from '@tanstack/react-table'
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { GenericTable, useBreakpoint } from '@zenlink-interface/ui'
import type { MarketPosition } from '@zenlink-interface/wagmi'
import { useMarketFilters } from 'components'
import { type FC, useCallback, useEffect, useState } from 'react'
import { PAGE_SIZE } from '../constants'
import {
  LP_BALANCE_COLUMN,
  NAME_COLUMN,
  PT_BALANCE_COLUMN,
  SY_BALANCE_COLUMN,
  YT_BALANCE_COLUMN,
} from './Cells/columns'

const COLUMNS = [NAME_COLUMN, SY_BALANCE_COLUMN, PT_BALANCE_COLUMN, YT_BALANCE_COLUMN, LP_BALANCE_COLUMN]

interface PositionsTableParams {
  positions: MarketPosition[] | undefined
}

export const PositionsTable: FC<PositionsTableParams> = ({ positions }) => {
  const { query, extraQuery, activeOnly } = useMarketFilters()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'lpBalance', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})

  const table = useReactTable<MarketPosition>({
    data: positions || [],
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
        syBalance: false,
        ptBalance: false,
      })
    }
    else if (isSm) {
      setColumnVisibility({})
    }
    else {
      setColumnVisibility({
        syBalance: false,
        ptBalance: false,
        ytBalance: false,
      })
    }
  }, [isMd, isSm])

  const rowLink = useCallback((row: MarketPosition) => {
    return `/${row.market.address}`
  }, [])

  return (
    <>
      <GenericTable<MarketPosition>
        linkFormatter={rowLink}
        pageSize={PAGE_SIZE}
        placeholder="No markets found"
        table={table}
        tdClassName="h-[68px]"
      />
    </>
  )
}
