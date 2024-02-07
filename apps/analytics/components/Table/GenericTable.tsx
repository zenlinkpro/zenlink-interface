import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'
import { LoadingOverlay, Table, Tooltip, Typography, classNames } from '@zenlink-interface/ui'
import type { ColumnDef, Table as ReactTableType } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import React, { useState } from 'react'

interface GenericTableProps<C> {
  table: ReactTableType<C>
  columns: ColumnDef<C>[]
  HoverElement?: React.FunctionComponent<{ row: C }>
  loading?: boolean
  placeholder: ReactNode
  pageSize: number
  linkFormatter?: (path: string) => string
}

export function GenericTable<T extends { id: string }>({
  table,
  HoverElement,
  loading,
  placeholder,
  pageSize,
  linkFormatter,
}: GenericTableProps<T>) {
  const [showOverlay, setShowOverlay] = useState(false)

  const headers = table.getFlatHeaders()

  return (
    <>
      <LoadingOverlay show={showOverlay} />
      <Table.container>
        <Table.table showShadow={table.getRowModel().rows.length > 5} style={{ minHeight: (pageSize + 1) * 52 }}>
          <Table.thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Table.thr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Table.th
                    colSpan={header.colSpan}
                    key={header.id}
                    style={{
                      maxWidth: header.column.getSize(),
                      width: header.column.getSize(),
                    }}
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
                        asc: <ArrowUpIcon height={14} width={14} />,
                        desc: <ArrowDownIcon height={14} width={14} />,
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
                    <Tooltip content={<HoverElement row={row.original} />} key={row.id}>
                      <Table.tr
                        className={classNames(!!linkFormatter && 'cursor-pointer')}
                        onClick={(e) => {
                          if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey) {
                            if (!linkFormatter)
                              return
                            setTimeout(() => setShowOverlay(true), 250)
                          }
                        }}
                      >
                        {row.getVisibleCells().map((cell, i) => {
                          return (
                            <Table.td
                              className="!px-0 relative"
                              key={cell.id}
                              style={{
                                maxWidth: headers[i].getSize(),
                                width: headers[i].getSize(),
                              }}
                            >
                              {linkFormatter
                                ? (
                                  <a href={linkFormatter ? linkFormatter(row.original.id) : `/${row.original.id}`}>
                                    <div
                                      className={classNames(
                                        'absolute inset-0 flex items-center px-3 sm:px-4',
                                        cell.column.columnDef.meta?.className,
                                      )}
                                    >
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                  </a>
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
                    className={classNames(!!linkFormatter && 'cursor-pointer')}
                    key={row.id}
                    onClick={(e) => {
                      if (!linkFormatter)
                        return
                      if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey)
                        setShowOverlay(true)
                    }}
                  >
                    {row.getVisibleCells().map((cell, i) => {
                      return (
                        <Table.td
                          className="!px-0 relative"
                          key={cell.id}
                          style={{
                            maxWidth: headers[i].getSize(),
                            width: headers[i].getSize(),
                          }}
                        >
                          {linkFormatter
                            ? (
                              <a href={linkFormatter ? linkFormatter(row.original.id) : `/${row.original.id}`}>
                                <div
                                  className={classNames(
                                    'absolute inset-0 flex items-center px-3 sm:px-4',
                                    cell.column.columnDef.meta?.className,
                                  )}
                                >
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </div>
                              </a>
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
                      <Table.td
                        key={column.id}
                        style={{
                          maxWidth: column.columnDef.size,
                          width: column.columnDef.size,
                        }}
                      >
                        {column.columnDef.meta?.skeleton}
                      </Table.td>
                    )
                  })}
                </Table.tr>
            ))}
            {!loading && table.getRowModel().rows.length === 0 && (
              <Table.tr className="!h-[260px]">
                <Table.td className="!h-[260px]" colSpan={table.getAllColumns().length}>
                  <Typography className="text-slate-600 dark:text-slate-400 italic w-full text-center" variant="xs">
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
