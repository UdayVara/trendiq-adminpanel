'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Category, Enviroment } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import AddEditCategoryDialog from '../_components/AddEditCategoryDialog';
import Image from 'next/image';


export const columns: ColumnDef<Category>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'image',
    header: ' Image',
    cell: ({ row }) => (
      <>
      <Image
        src={row.original?.imageUrl || ''}
        alt={row.original?.name || ''}
        width={1000}
        height={1000}
        className="h-14 w-14 object-top object-contain  rounded"
        />
        </>
    )
  },
  {
    accessorKey: 'name',
    header: 'Category Name'
  },
  {
    accessorKey: 'gender',
    header: 'Gender'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => (
      <AddEditCategoryDialog
        isEdit={true}
        category={row.original || null}
        onComplete={() => table.resetRowSelection()}
      />
    )
  }
];
