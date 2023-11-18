import type { PaginationState, SortingState } from '@tanstack/react-table'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Pool } from '@zenlink-interface/graph-client'
import { GenericTable, Table, useBreakpoint } from '@zenlink-interface/ui'
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import stringify from 'fast-json-stable-stringify'
import useSWR from 'swr'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePoolFilters } from 'components/PoolsFiltersProvider'
import { PAGE_SIZE } from '../constants'
import { APR_COLUMN, FEES_COLUMN, NAME_COLUMN, NETWORK_COLUMN, TVL_COLUMN, VOLUME_COLUMN } from './Cells/columns'

const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, TVL_COLUMN, VOLUME_COLUMN, FEES_COLUMN, APR_COLUMN]

async function fetcher({
  url,
  args,
}: {
  url: string | null
  args: {
    sorting: SortingState
    pagination: PaginationState
    query: string
    extraQuery: string
    selectedNetworks: ParachainId[]
    selectedPoolTypes: string[]
    incentivizedOnly: boolean
  }
}): Promise<Pool[] | undefined> {
  if (!url)
    return Promise.resolve([])
  const _url = new URL(url, window.location.origin)

  if (args.sorting[0]) {
    _url.searchParams.set('orderBy', args.sorting[0].id)
    _url.searchParams.set('orderDirection', args.sorting[0].desc ? 'desc' : 'asc')
  }

  if (args.pagination)
    _url.searchParams.set('pagination', stringify(args.pagination))

  if (args.selectedNetworks)
    _url.searchParams.set('networks', stringify(args.selectedNetworks))

  const where: { [key: string]: any } = {}
  if (args.query)
    where.name_contains_nocase = args.query
  if (args.selectedPoolTypes)
    where.type_in = args.selectedPoolTypes
  where.farms_only = args.incentivizedOnly

  if (Object.keys(where).length > 0)
    _url.searchParams.set('where', JSON.stringify(where))

  return fetch(_url.href)
    .then(res => res.json())
    .catch()
}

export const PoolsTable: FC = () => {
  const {
    query,
    extraQuery,
    selectedNetworks,
    selectedPoolTypes,
    atLeastOneFilterSelected,
    incentivizedOnly,
  } = usePoolFilters()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const args = useMemo(
    () => ({
      sorting,
      pagination,
      selectedNetworks,
      selectedPoolTypes,
      query,
      extraQuery,
      incentivizedOnly,
    }),
    [sorting, pagination, selectedNetworks, selectedPoolTypes, query, extraQuery, incentivizedOnly],
  )

  const { data: pools, isValidating } = useSWR({ url: '/pool/api/pools', args }, fetcher)
  const { data: poolCount } = useSWR<number>(
    `/pool/api/pools/count${selectedNetworks ? `?networks=${stringify(selectedNetworks)}` : ''}`,
    (url: string) => fetch(url).then(response => response.json()),
  )

  const table = useReactTable<Pool>({
    data: pools || [],
    columns: COLUMNS,
    state: {
      sorting,
      columnVisibility,
    },
    pageCount: Math.ceil((poolCount || 0) / PAGE_SIZE),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
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

  const rowLink = useCallback((row: Pool) => {
    return `/${row.id}`
  }, [])

  return (
    <>
      <GenericTable<Pool>
        linkFormatter={rowLink}
        loading={!pools && isValidating}
        pageSize={PAGE_SIZE}
        placeholder="No pools found"
        table={table}
      />
      <Table.Paginator
        hasNext={
          !atLeastOneFilterSelected ? pagination.pageIndex < table.getPageCount() : (pools?.length || 0) >= PAGE_SIZE
        }
        hasPrev={pagination.pageIndex > 0}
        nextDisabled={!pools && isValidating}
        onNext={table.nextPage}
        onPage={table.setPageIndex}
        onPrev={table.previousPage}
        page={pagination.pageIndex}
        pageSize={PAGE_SIZE}
        pages={!atLeastOneFilterSelected ? table.getPageCount() : undefined}
      />
    </>
  )
}
