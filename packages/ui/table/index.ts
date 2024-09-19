import type { FC } from 'react'
import type React from 'react'

import type { TableContainerProps } from './Container'
import type { PaginatorProps } from './Paginator'
import type { RootProps } from './Root'
import type { RowProps } from './Row'
import tbody from './Body'
import td from './Cell'
import container from './Container'
import thead from './Head'
import th from './HeadCell'
import thr from './HeadRow'
import { Paginator } from './Paginator'
import table from './Root'
import tr from './Row'

export interface TableProps {
  container: FC<TableContainerProps>
  thead: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>>
  table: FC<RootProps>
  tr: FC<RowProps>
  thr: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>>
  th: FC<React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>>
  td: FC<React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>>
  tbody: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>>
  Paginator: FC<PaginatorProps>
}

export const Table: TableProps = { container, thead, table, tr, thr, th, td, tbody, Paginator }

export * from './GenericTable'
