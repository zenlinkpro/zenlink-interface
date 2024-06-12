import type { PaginationState, SortingState } from '@tanstack/react-table'
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { GenericTable, Table, useBreakpoint } from '@zenlink-interface/ui'
import type { MarketPosition } from '@zenlink-interface/wagmi'
import { useMarketFilters } from 'components'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { getUnixTime } from 'date-fns'
import { JSBI } from '@zenlink-interface/math'
import { usePrices } from '@zenlink-interface/shared'
import { ParachainId } from '@zenlink-interface/chain'
import { PAGE_SIZE } from '../constants'
import {
  LP_BALANCE_COLUMN,
  MATURITY_COLUMN,
  NAME_COLUMN,
  PT_BALANCE_COLUMN,
  SY_BALANCE_COLUMN,
  YT_BALANCE_COLUMN,
} from './Cells/columns'

const COLUMNS = [NAME_COLUMN, MATURITY_COLUMN, SY_BALANCE_COLUMN, PT_BALANCE_COLUMN, YT_BALANCE_COLUMN, LP_BALANCE_COLUMN]

interface PositionsTableParams {
  positions: MarketPosition[] | undefined
  isLoading: boolean
}

export const PositionsTable: FC<PositionsTableParams> = ({ positions, isLoading }) => {
  const { query, activeOnly, atLeastOneFilterSelected } = useMarketFilters()
  const { data: priceMap } = usePrices({ chainId: ParachainId.MOONBEAM })
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'lpBalance', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const filteredPositions = useMemo(() => {
    if (!positions)
      return undefined
    let _positions = [...positions]

    if (query) {
      _positions = _positions.filter(position => position.market.SY.yieldToken.symbol?.toLowerCase().includes(query.toLowerCase()))
    }

    const now = getUnixTime(Date.now())
    if (activeOnly) {
      _positions = _positions.filter(position => JSBI.toNumber(position.market.expiry) >= now)
    }
    else {
      _positions = _positions.filter(position => JSBI.toNumber(position.market.expiry) < now)
    }

    const fromIndex = pagination.pageIndex * pagination.pageSize
    const toIndex = (pagination.pageIndex + 1) * pagination.pageSize

    return _positions.sort((a, b) => {
      const orderBy = sorting[0]?.id || 'lpBalance'
      const orderDirection = sorting[0]?.desc ? 'desc' : 'asc'

      switch (orderBy) {
        case 'maturity': {
          if (orderDirection === 'asc') {
            return JSBI.toNumber(a.market.expiry) - JSBI.toNumber(b.market.expiry)
          }
          else {
            return JSBI.toNumber(b.market.expiry) - JSBI.toNumber(a.market.expiry)
          }
        }
        default: {
          const _orderBy = orderBy as keyof Omit<MarketPosition, 'id' | 'market'>
          const aBalance = a[_orderBy]
          const bBalance = b[_orderBy]

          if (!aBalance || !bBalance || !priceMap)
            return 0

          const aUSD = Number(aBalance.toExact() || '0') * Number(priceMap[aBalance.currency.wrapped.address]?.toSignificant(6) || '0')
          const bUSD = Number(bBalance.toExact() || '0') * Number(priceMap[bBalance.currency.wrapped.address]?.toSignificant(6) || '0')

          if (orderDirection === 'asc') {
            return aUSD - bUSD
          }
          else {
            return bUSD - aUSD
          }
        }
      }
    })
      .slice(fromIndex, toIndex)
  }, [activeOnly, pagination.pageIndex, pagination.pageSize, positions, priceMap, query, sorting])

  const table = useReactTable<MarketPosition>({
    data: filteredPositions || [],
    columns: COLUMNS,
    state: {
      sorting,
      columnVisibility,
    },
    pageCount: Math.ceil((positions?.length || 0) / PAGE_SIZE),
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
       <Table.Paginator
         hasNext={
          !atLeastOneFilterSelected ? pagination.pageIndex < table.getPageCount() : (filteredPositions?.length || 0) >= PAGE_SIZE
        }
         hasPrev={pagination.pageIndex > 0}
         nextDisabled={!filteredPositions && isLoading}
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
