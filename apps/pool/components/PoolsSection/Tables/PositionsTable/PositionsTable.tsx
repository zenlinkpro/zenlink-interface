import { GenericTable, useBreakpoint } from '@zenlink-interface/ui'
import type { SortingState } from '@tanstack/react-table'
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { usePoolFilters } from 'components'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import type { LiquidityPosition, POOL_TYPE } from '@zenlink-interface/graph-client'
import stringify from 'fast-json-stable-stringify'
import type { ParachainId } from '@zenlink-interface/chain'
import { useAccount } from '@zenlink-interface/compat'
import { APR_COLUMN, NAME_COLUMN, NETWORK_COLUMN, VALUE_COLUMN } from './Cells/columns'

const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, VALUE_COLUMN, APR_COLUMN]

const fetcher = ({
  url,
  args,
}: {
  url: string | null
  args: {
    sorting: SortingState
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

  if (args.selectedNetworks)
    _url.searchParams.set('networks', stringify(args.selectedNetworks))

  const where: { [key: string]: any } = {}
  if (args.query)
    where.name_contains_nocase = args.query
  if (args.selectedPoolTypes)
    where.type_in = args.selectedPoolTypes

  if (Object.keys(where).length > 0)
    _url.searchParams.set('where', JSON.stringify(where))

  return fetch(_url.href)
    .then(res => res.json())
    .catch()
}

export const PositionsTable: FC = () => {
  const { query, extraQuery, selectedNetworks, selectedPoolTypes } = usePoolFilters()
  const { address } = useAccount()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'value', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})

  const args = useMemo(
    () => ({ sorting, selectedNetworks, selectedPoolTypes, query, extraQuery }),
    [sorting, selectedNetworks, selectedPoolTypes, query, extraQuery],
  )

  const { data: userPools, isValidating } = useSWR<LiquidityPosition<POOL_TYPE>[]>(
    {
      url: address ? `/pool/api/user/${address}` : null,
      args,
    },
    fetcher,
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
