import type { SortingState } from '@tanstack/react-table'
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { ParachainId } from '@zenlink-interface/chain'
import type { Gauge } from '@zenlink-interface/market'
import { GenericTable, useBreakpoint } from '@zenlink-interface/ui'
import { useGauges } from '@zenlink-interface/wagmi'
import { type FC, useEffect, useState } from 'react'
import { PAGE_SIZE } from '../constants'
import { NAME_COLUMN } from './Cells/columns'

const COLUMNS = [NAME_COLUMN]

export const GaugesTable: FC = () => {
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})

  const { data: markets, isLoading } = useGauges(ParachainId.MOONBEAM)

  const table = useReactTable<Gauge>({
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
