'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import TablePagination from '@/components/ui/data-table/TablePagination';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { transactionQuery } from '@/api/transaction.actions';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Transaction } from '@/constants/data';
import { OrderQuery } from '@/api/order.actions';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export default function OrderTable<TData, TValue>({
  columns
}: DataTableProps<TData, TValue>) {
  const { data } = useSuspenseQuery(OrderQuery);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data: data.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // 🟢 required
    state: {
      globalFilter
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const { user, sessionId, orderId } = row.original as Transaction;
      const target = `${user?.username} ${user?.email} ${sessionId} ${orderId}`.toLowerCase();
      return target.includes(filterValue.toLowerCase());
    },
    onGlobalFilterChange: setGlobalFilter
  });

  const queryClient = useQueryClient();

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Input
          placeholder="Search by user, email, session or order ID"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-[300px]"
        />
      </div>

      <div className="rounded-md border mt-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getFilteredRowModel().rows.length ? (
              table.getFilteredRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} />
    </>
  );
}
