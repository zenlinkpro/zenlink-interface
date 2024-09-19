import type { ColumnDef } from '@tanstack/react-table'
import type { Code } from './types'
import { Trans } from '@lingui/macro'
import { CodeCell } from './CodeCell'

export const CODES_COLUMN: ColumnDef<Code, unknown> = {
  id: 'code',
  header: _ => <Trans>Code</Trans>,
  cell: props => <CodeCell row={props.row.original} />,
  size: 50,
  meta: {
    skeleton: <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-[26px] h-[26px] animate-pulse" />,
  },
}
