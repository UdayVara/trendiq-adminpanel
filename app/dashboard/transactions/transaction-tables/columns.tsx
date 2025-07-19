'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Transaction } from '@/constants/data';

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorFn: (row) => row.user.username,
    id: 'username',
    header: 'User',
    cell: ({ row }) => (
      <>
        <h6>{row.original.user.username}</h6>
        <p className="text-neutral-700 dark:text-neutral-400">
          {row.original.user.email}
        </p>
      </>
    ),
    enableSorting: true,
    enableGlobalFilter: true
  },
  {
    accessorFn: (row) => row.sessionId,
    id: 'sessionId',
    header: 'Session ID',
    cell: ({ row }) => row.original.sessionId,
    enableGlobalFilter: true
  },
  {
    accessorFn: (row) => row.orderId,
    id: 'orderId',
    header: 'Order ID',
    cell: ({ row }) => row.original.orderId,
    enableGlobalFilter: true
  },
  {
    accessorFn: (row) => row.createdAt,
    id: 'createdAt',
    header: 'Initiated At',
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), 'dd/MM/yyyy hh:mm a')
  },
  {
    accessorFn: (row) => row.status,
    id: 'status',
    header: 'Status',
    cell: ({ row }) => row.original.status,
    enableColumnFilter: true
  },
  {
    accessorFn: (row) => row.paymentStatus,
    id: 'paymentStatus',
    header: 'Payment Status',
    cell: ({ row }) => row.original.paymentStatus
  },
  {
    accessorFn: (row) => row.amount,
    id: 'amount',
    header: 'Amount',
    cell: ({ row }) => row.original.amount
  }
];
