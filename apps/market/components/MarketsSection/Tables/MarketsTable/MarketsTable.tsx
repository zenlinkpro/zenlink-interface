import { GenericTable, Table, useBreakpoint } from '@zenlink-interface/ui'
import { useMarketFilters } from 'components/MarketsFiltersProvider'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import {
  type PaginationState,
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { Market } from '@zenlink-interface/market'
import { JSBI } from '@zenlink-interface/math'
import { getUnixTime } from 'date-fns'
import type { MarketGraphData } from '@zenlink-interface/graph-client'
import { PAGE_SIZE } from '../constants'
import {
  FIXED_ROI_COLUMN,
  IMPLIED_APY_COLUMN,
  LIQUIDITY_COLUMN,
  LONG_YIELD_ROI_COLUMN,
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
  LONG_YIELD_ROI_COLUMN,
  FIXED_ROI_COLUMN,
]

interface MarketsTableParams {
  markets: Market[] | undefined
  isLoading: boolean
}

export const MarketsTable: FC<MarketsTableParams> = ({ markets, isLoading }) => {
  const { query, activeOnly, atLeastOneFilterSelected, marketsGraphDataMap } = useMarketFilters()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'reserveUSD', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const filteredMarkets = useMemo(() => {
    if (!markets)
      return undefined

    let _markets = [...markets]
    if (query) {
      _markets = _markets.filter(market => market.SY.yieldToken.symbol?.toLowerCase().includes(query.toLowerCase()))
    }

    const now = getUnixTime(Date.now())
    if (activeOnly) {
      _markets = _markets.filter(market => JSBI.toNumber(market.expiry) >= now)
    }
    else {
      _markets = _markets.filter(market => JSBI.toNumber(market.expiry) < now)
    }

    const fromIndex = pagination.pageIndex * pagination.pageSize
    const toIndex = (pagination.pageIndex + 1) * pagination.pageSize
    const orderBy = sorting[0]?.id || 'reserveUSD'
    const orderDirection = sorting[0]?.desc ? 'desc' : 'asc'

    return _markets.sort((a, b) => {
      const graphA = marketsGraphDataMap[a.address.toLowerCase()]
      const graphB = marketsGraphDataMap[b.address.toLowerCase()]
      if (!graphA || !graphB)
        return 0

      switch (orderBy) {
        case 'maturity': {
          if (orderDirection === 'asc') {
            return JSBI.toNumber(a.expiry) - JSBI.toNumber(b.expiry)
          }
          else {
            return JSBI.toNumber(b.expiry) - JSBI.toNumber(a.expiry)
          }
        }
        default: {
          const _orderBy = orderBy as keyof MarketGraphData
          if (orderDirection === 'asc') {
            return Number(graphA[_orderBy]) - Number(graphB[_orderBy])
          }
          else {
            return Number(graphB[_orderBy]) - Number(graphA[_orderBy])
          }
        }
      }
    })
      .slice(fromIndex, toIndex)
  }, [activeOnly, markets, marketsGraphDataMap, pagination.pageIndex, pagination.pageSize, query, sorting])

  const table = useReactTable<Market>({
    data: filteredMarkets || [],
    columns: COLUMNS,
    state: {
      sorting,
      columnVisibility,
    },
    pageCount: Math.ceil((markets?.length || 0) / PAGE_SIZE),
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
      <Table.Paginator
        hasNext={
          !atLeastOneFilterSelected ? pagination.pageIndex < table.getPageCount() : (filteredMarkets?.length || 0) >= PAGE_SIZE
        }
        hasPrev={pagination.pageIndex > 0}
        nextDisabled={!filteredMarkets && isLoading}
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
