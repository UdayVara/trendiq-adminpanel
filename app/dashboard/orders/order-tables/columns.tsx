'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import Link from 'next/link';

export type OrderSummary = {
  username: string;
  email: string;
  orderId: string;
  totalAmount: number;
  totalDiscount: number;
  finalAmount: number;
  createdAt: string;
  status: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    [key: string]: any;
  };
};

export const columns: ColumnDef<OrderSummary>[] = [
  {
    accessorKey: 'username',
    header: 'User',
    cell: ({ row }) => (
      <>
        <h6>{row.original.username}</h6>
        <p className="text-neutral-700 dark:text-neutral-400">{row.original.email}</p>
      </>
    ),
    enableSorting: true
  },
  {
    accessorKey: 'orderId',
    header: 'Order ID',
    cell: ({ row }) => row.original.orderId,
    enableSorting: true
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
    cell: ({ row }) => `₹${Math.floor(row.original.totalAmount)}`
  },
  {
    accessorKey: 'totalDiscount',
    header: 'Total Discount',
    cell: ({ row }) => `₹${Math.floor(row.original.totalDiscount)}`
  },
  {
    accessorKey: 'finalAmount',
    header: 'Final Amount',
    cell: ({ row }) => `₹${Math.floor(row.original.finalAmount)}`
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => format(new Date(row.original.createdAt), 'dd/MM/yyyy hh:mm a')
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => row.original.status
  },
  {
    accessorKey: 'address',
    header: 'Address',
   cell: ({ row }) => row.original.address?.address
  },
  {
    accessorKey: 'Actions',
    header: 'Actions',
    cell: ({ row }) => <>
    <div className="flex flex-row gap-4 items-center">
      <Link href={`/dashboard/orders/${row.original.orderId}`}>

      <Button variant={"ghost"} className='text-nowrap grow text-primary' size={"sm"}>View</Button></Link>
      <Button variant={"ghost"} className='text-nowrap grow text-primary' size={"sm"}>Status</Button>
    </div>
    </>
  }
];
