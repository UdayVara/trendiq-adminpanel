'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { Button } from '@/components/ui/button';
import TablePagination from '@/components/ui/data-table/TablePagination';
import { toast } from 'sonner';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { deleteSize, sizeQuery } from '@/api/size.actions';
import AddEditSizeDialog from '../_components/AddEditSizeDialog';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export default function SizeTable<TData, TValue>({
  columns
}: DataTableProps<TData, TValue>) {
  const { data } = useSuspenseQuery(sizeQuery);
  const table = useReactTable({
    data:data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      const res = await deleteSize({
        id: table.getSelectedRowModel().rows.map((row: any) => row.original.id).join(",")
      });
      if (res.success) {
        toast.success(res.message || 'Deleted Successfully');
        table.resetRowSelection();
        table.resetColumnFilters();
        table.resetSorting();
        table.setGlobalFilter('');

        queryClient.invalidateQueries({
          queryKey: ['sizes']
        });
      }
    } catch (error: any) {
      toast(error.message || 'Failed to Delete Sizes');
    }
  };
  return (
    <>
      <div className="mb-2 flex flex-row items-center justify-end">
        {table.getSelectedRowModel().rows.length > 0 && (
          <Button
            variant={'destructive'}
            onClick={handleDelete}
            disabled={table.getSelectedRowModel().rows.length === 0}
          >
            Delete
          </Button>
        )}
        <AddEditSizeDialog isEdit={false} />
      </div>
      <div className="rounded-md border mt-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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
