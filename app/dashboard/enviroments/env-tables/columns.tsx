'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Enviroment } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import AddEditEnviromentDialog from '../_components/AddEditEnviromentDialog';

export const columns: ColumnDef<Enviroment>[] = [
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
    accessorKey: 'key',
    header: 'Enviroment Name'
  },
  {
    accessorKey: 'value',
    header: 'Enviroment value'
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => (
      <AddEditEnviromentDialog
        isEdit={true}
        enviroment={row.original || null}
        onComplete={() => table.resetRowSelection()}
      />
    )
  }
];
