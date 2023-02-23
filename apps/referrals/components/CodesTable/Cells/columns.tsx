import type { ColumnDef } from '@tanstack/react-table'
import { CodeCell } from './CodeCell'
import type { Code } from './types'

export const CODES_COLUMN: ColumnDef<Code, unknown> = {
  id: 'code',
  header: 'Code',
  cell: props => <CodeCell row={props.row.original} />,
  size: 50,
  meta: {
    skeleton: <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
  },
}
