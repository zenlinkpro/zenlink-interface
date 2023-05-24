import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'
import type { Table as ReactTableType, RowData } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import React, { useState } from 'react'

import { Link, Table, classNames } from '..'
import { LoadingOverlay } from '../loader'
import { Tooltip } from '../tooltip'
import { Typography } from '../typography'

interface GenericTableProps<C> {
  table: ReactTableType<C>
  HoverElement?: React.FunctionComponent<{ row: C }>
  loading?: boolean
  placeholder: ReactNode
  pageSize: number
  linkFormatter?(row: C): string
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string
    skeleton: ReactNode
  }
}

export const GenericTable = <T extends { id: string }>({
  table,
  HoverElement,
  loading,
  placeholder,
  pageSize,
  linkFormatter,
}: GenericTableProps<T>) => {
  const [showOverlay, setShowOverlay] = useState(false)
  const [popupInvisible, setPopupInvisible] = useState(false)

  const headers = table.getFlatHeaders()

  return (
    <>
      <LoadingOverlay show={showOverlay} />
      <Table.container>
        <Table.table style={{ minHeight: (pageSize + 1) * 52 }} showShadow={table.getRowModel().rows.length > 5}>
          <Table.thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Table.thr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Table.th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ maxWidth: header.column.getSize(), width: header.column.getSize() }}
                  >
                    <div
                      {...{
                        className: classNames(
                          header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                          header.column.columnDef?.meta?.className,
                          'h-full flex items-center gap-2',
                        ),
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ArrowUpIcon width={14} height={14} />,
                        desc: <ArrowDownIcon width={14} height={14} />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </Table.th>
                ))}
              </Table.thr>
            ))}
          </Table.thead>
          <Table.tbody>
            {!loading
              && table.getRowModel().rows.map((row) => {
                if (HoverElement) {
                  return (
                    <Tooltip
                      key={row.id}
                      content={<HoverElement row={row.original} />}
                    >
                      <Table.tr
                        onClick={(e) => {
                          if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey) {
                            if (!linkFormatter)
                              return
                            setPopupInvisible(true)
                            setTimeout(() => setShowOverlay(true), 250)
                          }
                        }}
                        className={classNames(!!linkFormatter && 'cursor-pointer')}
                      >
                        {row.getVisibleCells().map((cell, i) => {
                          return (
                            <Table.td
                              className="!px-0 relative"
                              style={{ maxWidth: headers[i].getSize(), width: headers[i].getSize() }}
                              key={cell.id}
                            >
                              {linkFormatter
                                ? (
                                  <Link.Internal href={linkFormatter(row.original)} passHref={true}>
                                    <div
                                      className={classNames(
                                        'absolute inset-0 flex items-center px-3 sm:px-4',
                                        cell.column.columnDef.meta?.className,
                                      )}
                                    >
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                  </Link.Internal>
                                  )
                                : (
                                  <div
                                    className={classNames(
                                      'absolute inset-0 flex items-center px-3 sm:px-4',
                                      cell.column.columnDef.meta?.className,
                                    )}
                                  >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </div>
                                  )}
                            </Table.td>
                          )
                        })}
                      </Table.tr>
                    </Tooltip>
                  )
                }

                return (
                  <Table.tr
                    key={row.id}
                    onClick={(e) => {
                      if (!linkFormatter)
                        return
                      if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey)
                        setShowOverlay(true)
                    }}
                    className={classNames(!!linkFormatter && 'cursor-pointer')}
                  >
                    {row.getVisibleCells().map((cell, i) => {
                      return (
                        <Table.td
                          className="!px-0 relative"
                          style={{ maxWidth: headers[i].getSize(), width: headers[i].getSize() }}
                          key={cell.id}
                        >
                          {linkFormatter
                            ? (
                              <Link.Internal href={linkFormatter(row.original)} passHref={true}>
                                <div
                                  className={classNames(
                                    'absolute inset-0 flex items-center px-3 sm:px-4',
                                    cell.column.columnDef.meta?.className,
                                  )}
                                >
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </div>
                              </Link.Internal>
                              )
                            : (
                              <div
                                className={classNames(
                                  'absolute inset-0 flex items-center px-3 sm:px-4',
                                  cell.column.columnDef.meta?.className,
                                )}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </div>
                              )}

                        </Table.td>
                      )
                    })}
                  </Table.tr>
                )
              })}
            {!loading
              && table.getRowModel().rows.length !== 0
              && Array.from(Array(Math.max(pageSize - table.getRowModel().rows.length, 0))).map((el, index) => (
                <Table.tr key={index}>
                  {table.getVisibleFlatColumns().map(column => (
                    <Table.td key={column.id} style={{ maxWidth: column.getSize(), width: column.getSize() }} />
                  ))}
                </Table.tr>
              ))}
            {loading
              && Array.from(Array(pageSize)).map((el, index) => (
                <Table.tr key={index}>
                  {table.getVisibleFlatColumns().map((column) => {
                    return (
                      <Table.td key={column.id} style={{ maxWidth: column.getSize(), width: column.getSize() }}>
                        {column.columnDef.meta?.skeleton}
                      </Table.td>
                    )
                  })}
                </Table.tr>
              ))}
            {!loading && table.getRowModel().rows.length === 0 && (
              <Table.tr className="!h-[260px]">
                <Table.td colSpan={table.getAllColumns().length} className="!h-[260px]">
                  <Typography variant="xs" className="text-slate-600 dark:text-slate-400 italic w-full text-center">
                    {placeholder}
                  </Typography>
                </Table.td>
              </Table.tr>
            )}
          </Table.tbody>
        </Table.table>
      </Table.container>
    </>
  )
}
