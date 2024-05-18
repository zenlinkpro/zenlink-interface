import type { SortingState } from '@tanstack/react-table'
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import type { Gauge } from '@zenlink-interface/market'
import { GenericTable, useBreakpoint } from '@zenlink-interface/ui'
import { type FC, useEffect, useState } from 'react'
import { useGaugeVotes } from 'components'
import { PAGE_SIZE } from '../constants'
import { COMMUNITY_VOTE_COLUMN, MY_VOTE_COLUMN, NAME_COLUMN } from './Cells/columns'

const COLUMNS = [NAME_COLUMN, COMMUNITY_VOTE_COLUMN, MY_VOTE_COLUMN]

export const GaugesTable: FC = () => {
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})

  const { gauges, isLoading } = useGaugeVotes()

  const table = useReactTable<Gauge>({
    data: gauges || [],
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

  return (
    <>
      <GenericTable<Gauge>
        loading={isLoading}
        pageSize={PAGE_SIZE}
        placeholder="No markets found"
        table={table}
      />
    </>
  )
}
