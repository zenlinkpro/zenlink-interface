import type { FC } from 'react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { GenericTable } from '@zenlink-interface/ui'
import type { DiscountTiers } from 'lib/hooks'
import { DISCOUNTS_COLUMN, POSITIONS_COLUMN, TIERS_COLUMN } from './Cells/columns'

const COLUMNS = [TIERS_COLUMN, POSITIONS_COLUMN, DISCOUNTS_COLUMN]

interface DiscountTableProps {
  data: DiscountTiers[]
}

export const DiscountTable: FC<DiscountTableProps> = ({ data }) => {
  const table = useReactTable<DiscountTiers>({
    data,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
      <GenericTable<DiscountTiers>
        table={table}
        loading={false}
        placeholder="empty"
        pageSize={data.length}
      />
    </>
  )
}
