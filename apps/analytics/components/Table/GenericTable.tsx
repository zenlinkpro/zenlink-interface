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
  linkFormatter?(path: string): string
}

export const GenericTable = <T extends { id: string }>({
  table,
  columns,
  HoverElement,
  loading,
  placeholder,
  pageSize,
  linkFormatter,
}: GenericTableProps<T>) => {
  const [showOverlay, setShowOverlay] = useState(false)

  return (
    <>
      <LoadingOverlay show={showOverlay} />
      <Table.container>
        <Table.table style={{ minHeight: (pageSize + 1) * 52 }}>
          <Table.thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Table.thr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Table.th
                    key={header.id}
                    colSpan={header.colSpan}
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
                      destroyTooltipOnHide={true}
                      key={row.id}
                      trigger="hover"
                      mouseEnterDelay={0.5}
                      placement="top"
                      button={
                        <Table.tr
                          onClick={(e) => {
                            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey)
                              setShowOverlay(true)
                          }}
                          className="cursor-pointer"
                        >
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <Table.td
                                style={{
                                  maxWidth: columns[0].size,
                                  width: columns[0].size,
                                }}
                                key={cell.id}
                              >
                                <a href={linkFormatter ? linkFormatter(row.original.id) : `/${row.original.id}`}>
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </a>
                              </Table.td>
                            )
                          })}
                        </Table.tr>
                      }
                      panel={<HoverElement row={row.original} />}
                    />
                  )
                }

                return (
                  <Table.tr
                    key={row.id}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey)
                        setShowOverlay(true)
                    }}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Table.td
                          style={{
                            maxWidth: columns[0].size,
                            width: columns[0].size,
                          }}
                          key={cell.id}
                        >
                          <a href={linkFormatter ? linkFormatter(row.original.id) : `/${row.original.id}`}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </a>
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
                  {columns.map(column => (
                    <Table.td key={column.id} style={{ maxWidth: column.size, width: column.size }} />
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
                <Table.td colSpan={table.getAllColumns().length} className="!h-[260px]">
                  <Typography variant="xs" className="w-full italic text-center text-slate-400">
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
