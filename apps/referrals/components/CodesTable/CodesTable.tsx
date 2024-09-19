import type { FC } from 'react'
import type { Code } from './Cells/types'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { GenericTable } from '@zenlink-interface/ui'
import { useMemo } from 'react'
import { CODES_COLUMN } from './Cells/columns'

const COLUMNS = [CODES_COLUMN]

interface CodesTableProps {
  chainId: number
  codes: string[]
}

export const CodesTable: FC<CodesTableProps> = ({ codes, chainId }) => {
  const data = useMemo(
    () => codes.map(code => ({ id: code, code, chainId })),
    [chainId, codes],
  )
  const table = useReactTable<Code>({
    data,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <GenericTable<Code>
        loading={false}
        pageSize={data.length}
        placeholder="No codes found"
        table={table}
      />
    </>
  )
}
