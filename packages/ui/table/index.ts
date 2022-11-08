import type { FC } from 'react'
import type React from 'react'

import tbody from './Body'
import td from './Cell'
import type { TableContainerProps } from './Container'
import container from './Container'
import thead from './Head'
import th from './HeadCell'
import thr from './HeadRow'
import type { PaginatorProps } from './Paginator'
import { Paginator } from './Paginator'
import table from './Root'
import type { RowProps } from './Row'
import tr from './Row'

export interface TableProps {
  container: FC<TableContainerProps>
  thead: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>>
  table: FC<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>>
  tr: FC<RowProps>
  thr: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>>
  th: FC<React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>>
  td: FC<React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>>
  tbody: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>>
  Paginator: FC<PaginatorProps>
}

export const Table: TableProps = { container, thead, table, tr, thr, th, td, tbody, Paginator }

export * from './GenericTable'
