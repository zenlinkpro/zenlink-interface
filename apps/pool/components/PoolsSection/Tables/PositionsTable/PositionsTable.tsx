import { GenericTable, useBreakpoint } from '@zenlink-interface/ui'
import type { SortingState } from '@tanstack/react-table'
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { usePoolFilters } from 'components'
import type { FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import useSWR from 'swr'
import type { LiquidityPosition, POOL_TYPE } from '@zenlink-interface/graph-client'
import stringify from 'fast-json-stable-stringify'
import { APR_COLUMN, NAME_COLUMN, NETWORK_COLUMN, VALUE_COLUMN } from './Cells/columns'

const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, VALUE_COLUMN, APR_COLUMN]

export const PositionsTable: FC = () => {
  const { selectedNetworks } = usePoolFilters()
  const { address } = useAccount()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'value', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})

  const { data: userPools, isValidating } = useSWR<LiquidityPosition<POOL_TYPE>[]>(
    address ? `/pool/api/user/${address}${selectedNetworks ? `?networks=${stringify(selectedNetworks)}` : ''}` : null,
    url => fetch(url).then(response => response.json()),
  )

  const table = useReactTable<LiquidityPosition<POOL_TYPE>>({
    data: userPools || [],
    state: {
      sorting,
      columnVisibility,
    },
    columns: COLUMNS,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  useEffect(() => {
    if (isSm && !isMd)
      setColumnVisibility({ volume: false, network: false })

    else if (isSm)
      setColumnVisibility({})

    else
      setColumnVisibility({ volume: false, network: false, apr: false, liquidityUSD: false })
  }, [isMd, isSm])

  const rowLink = useCallback((row: LiquidityPosition<POOL_TYPE>) => {
    return `/${row.id}`
  }, [])

  return (
    <GenericTable<LiquidityPosition<POOL_TYPE>>
      table={table}
      loading={!userPools && isValidating}
      placeholder="No positions found"
      pageSize={Math.max(userPools?.length || 0, 5)}
      linkFormatter={rowLink}
    />
  )
}
