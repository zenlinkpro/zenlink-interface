import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Pool } from '@zenlink-interface/graph-client'
import { GenericTable, Table, useBreakpoint } from '@zenlink-interface/ui'
import {
  FEES_24H_COLUMN,
  FEES_7D_COLUMN,
  NAME_COLUMN,
  NETWORK_COLUMN,
  TVL_COLUMN,
  VOLUME_24H_COLUMN,
  VOLUME_7D_COLUMN,
} from 'components/Table/columns'
import stringify from 'fast-json-stable-stringify'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { PAGE_SIZE, usePoolFilters } from 'components'

const COLUMNS = [
  NETWORK_COLUMN,
  NAME_COLUMN,
  TVL_COLUMN,
  VOLUME_24H_COLUMN,
  VOLUME_7D_COLUMN,
  FEES_24H_COLUMN,
  FEES_7D_COLUMN,
]

const fetcher = async ({
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
  }
}) => {
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
  if (args.extraQuery)
    where.token1_symbol_contains_nocase = args.extraQuery
  if (args.selectedPoolTypes)
    where.type_in = args.selectedPoolTypes

  if (Object.keys(where).length > 0)
    _url.searchParams.set('where', JSON.stringify(where))

  return fetch(_url.href)
    .then(res => res.json())
    .catch()
}

export const PoolTable: FC = () => {
  const { query, extraQuery, selectedNetworks } = usePoolFilters()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')
  const { isLg } = useBreakpoint('lg')

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
      query,
      extraQuery,
    }),
    [sorting, pagination, selectedNetworks, query, extraQuery],
  )

  const { data: pools, isValidating } = useSWR<Pool[]>({ url: '/analytics/api/pools', args }, fetcher)
  const { data: poolCount } = useSWR<number>(
    `/analytics/api/pools/count${selectedNetworks ? `?networks=${stringify(selectedNetworks)}` : ''}`,
    url => fetch(url).then(response => response.json()),
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
    if (isSm && !isMd && !isLg) {
      setColumnVisibility({
        fees24h: false,
        volume24h: false,
        fees7d: false,
        network: false,
      })
    }
    else if (isSm && isMd && !isLg) {
      setColumnVisibility({ fees24h: false, volume24h: false, network: false })
    }
    else if (isSm) {
      setColumnVisibility({})
    }
    else {
      setColumnVisibility({
        fees24h: false,
        volume24h: false,
        network: false,
        fees7d: false,
        liquidityUSD: false,
      })
    }
  }, [isLg, isMd, isSm])

  const rowLink = useCallback((row: Pool) => {
    return `/pool/${row.id}`
  }, [])

  return (
    <>
      <GenericTable<Pool>
        table={table}
        loading={!pools && isValidating}
        placeholder="No pools found"
        pageSize={PAGE_SIZE}
        linkFormatter={rowLink}
      />
      <Table.Paginator
        hasPrev={pagination.pageIndex > 0}
        hasNext={pagination.pageIndex < table.getPageCount()}
        nextDisabled={!pools && isValidating}
        onPrev={table.previousPage}
        onNext={table.nextPage}
        page={pagination.pageIndex}
        onPage={table.setPageIndex}
        pages={table.getPageCount()}
        pageSize={PAGE_SIZE}
      />
    </>
  )
}
