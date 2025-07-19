'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Category, Enviroment, Size } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import AddEditCategoryDialog from '../_components/AddEditSizeDialog';
import AddEditSizeDialog from '../_components/AddEditSizeDialog';


export const columns: ColumnDef<Size>[] = [
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
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Size Name'
  },
  {
    accessorKey: 'category.name',
    header: 'Category Name'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => (
      <AddEditSizeDialog
        isEdit={true}
        size={row.original || null}
        onComplete={() => table.resetRowSelection()}
      />
    )
  }
];
