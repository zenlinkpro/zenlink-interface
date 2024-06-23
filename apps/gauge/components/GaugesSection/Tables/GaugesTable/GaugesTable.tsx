import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import type { Gauge } from '@zenlink-interface/market'
import { GenericTable, Table, useBreakpoint } from '@zenlink-interface/ui'
import { useGaugeVotes } from 'components'
import { type FC, useEffect, useMemo, useState } from 'react'
import { Percent } from '@zenlink-interface/math'
import { PAGE_SIZE } from '../constants'
import { COMMUNITY_VOTE_COLUMN, MY_VOTE_COLUMN, NAME_COLUMN } from './Cells/columns'

const COLUMNS = [NAME_COLUMN, COMMUNITY_VOTE_COLUMN, MY_VOTE_COLUMN]

export const GaugesTable: FC = () => {
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'communityVote', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const { gauges, isLoading, communityVotedPercentMap, votedPercentMap } = useGaugeVotes()

  const sortedGauges = useMemo(() => {
    if (!gauges)
      return []

    const fromIndex = pagination.pageIndex * pagination.pageSize
    const toIndex = (pagination.pageIndex + 1) * pagination.pageSize
    const orderBy = sorting[0]?.id
    const orderDirection = sorting[0]?.desc ? 'desc' : 'asc'

    return gauges.sort((a, b) => {
      switch (orderBy) {
        case 'communityVote': {
          const aLessThanB = communityVotedPercentMap[a.id].lessThan(communityVotedPercentMap[b.id])
          if (orderDirection === 'asc') {
            return aLessThanB ? -1 : 1
          }
          else {
            return aLessThanB ? 1 : -1
          }
        }
        case 'myVote': {
          const aLessThanB = (votedPercentMap[a.id] || new Percent(0)).lessThan(votedPercentMap[b.id] || new Percent(0))
          if (orderDirection === 'asc') {
            return aLessThanB ? -1 : 1
          }
          else {
            return aLessThanB ? 1 : -1
          }
        }
        default: {
          return 0
        }
      }
    })
      .slice(fromIndex, toIndex)
  }, [gauges, communityVotedPercentMap, votedPercentMap, sorting, pagination])

  const table = useReactTable<Gauge>({
    data: sortedGauges,
    columns: COLUMNS,
    state: {
      sorting,
      columnVisibility,
    },
    pageCount: Math.ceil((gauges?.length || 0) / PAGE_SIZE),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
  })

  useEffect(() => {
    if (isSm && !isMd) {
      setColumnVisibility({})
    }
    else if (isSm) {
      setColumnVisibility({})
    }
    else {
      setColumnVisibility({})
    }
  }, [isMd, isSm])

  return (
    <>
      <GenericTable<Gauge>
        loading={isLoading}
        pageSize={PAGE_SIZE}
        placeholder="No markets found"
        table={table}
        tdClassName="h-[68px]"
      />
      <Table.Paginator
        hasNext={pagination.pageIndex < table.getPageCount()}
        hasPrev={pagination.pageIndex > 0}
        nextDisabled={!sortedGauges && isLoading}
        onNext={table.nextPage}
        onPage={table.setPageIndex}
        onPrev={table.previousPage}
        page={pagination.pageIndex}
        pageSize={PAGE_SIZE}
        pages={table.getPageCount()}
      />
    </>
  )
}
