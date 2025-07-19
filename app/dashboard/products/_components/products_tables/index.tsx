'use client';

import {
  ColumnDef,
  ColumnFiltersState,
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
import { Button } from '@/components/ui/button';
import TablePagination from '@/components/ui/data-table/TablePagination';
import { toast } from 'sonner';

import {
  useQuery,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import {
  categoryQuery,
  deleteCategory,
  fetchCategories
} from '@/api/categories.actions';
import { deleteProducts, productsQuery } from '@/api/products.actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Category } from '@/constants/data';
import { Slider } from '@/components/ui/slider';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export default function ProductsTable<TData, TValue>({
  columns
}: DataTableProps<TData, TValue>) {
  const [val, setVal] = useState([200, 399]);
  const { data } = useSuspenseQuery(productsQuery);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data: data.data.original || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters
    },
    meta: {
      originalProducts: data.data.original || []
    }
  });

  const queryClient = useQueryClient();
  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  const handleDelete = async () => {
    try {
      console.log(table.getSelectedRowModel().rows)
      const res = await deleteProducts(
        table.getSelectedRowModel().rows.map((row: any) => row.original.productId)
      );
      if (res.success) {
        toast.success(res.message || 'Deleted Successfully');
        table.resetRowSelection();
        table.resetColumnFilters();
        table.resetSorting();
        table.setGlobalFilter('');

        queryClient.invalidateQueries({
          queryKey: ['products']
        });
      }
    } catch (error: any) {
      toast(error.message || 'Failed to Delete Enviroment');
    }
  };

  return (
    <>
      <div className="mb-3 flex flex-row items-center justify-between gap-3">
        <div className="grid grid-cols-12   gap-3">
          <Input
            placeholder="Search"
            value={(table.getColumn('title')?.getFilterValue() as string) || ''}
            onChange={(event) =>
              table.getColumn('title')?.setFilterValue(event.target.value)
            }
            className="col-span-3 w-full"
          />
          <Select
            onValueChange={(val) => {
              table.getColumn('gender')?.setFilterValue(val);
            }}
            value={
              (table.getColumn('gender')?.getFilterValue() as string) || ''
            }
          >
            <SelectTrigger className="col-span-3 w-full">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={''}>Any Gender</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="unisex">Unisex</SelectItem>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(val) => {
              table.getColumn('category')?.setFilterValue(val);
            }}
            value={
             (table.getColumn('category')?.getFilterValue() as string) || ''
            }
            defaultValue={''}
          >
            <SelectTrigger className="col-span-3 w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={''}>All Category</SelectItem>
              {categories.data?.data.map((category: Category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative col-span-2 flex flex-row items-center">
            <span className="absolute -top-1 right-1 text-xs text-primary ">
              {val[0]} - {val[1]}
            </span>
            <Slider
              min={200}
              defaultValue={val}
              value={val}
              onValueChange={(value) => {
                setVal(value);
              }}
              max={1500}
              onValueCommit={(value) => {
                table.getColumn('price')?.setFilterValue(value);
              }}
              className="w-full "
            />
          </div>
          <Button
            variant={'ghost'}
            className="col-span-1 text-primary"
            onClick={() => {
              table.resetColumnFilters();
              setVal([200, 399]);
            }}
          >
            Reset
          </Button>
        </div>
        <div className="flex flex-row items-center gap-2">
          {table.getSelectedRowModel().rows.length > 0 && (
            <Button
              variant={'destructive'}
              onClick={handleDelete}
              disabled={table.getSelectedRowModel().rows.length === 0}
            >
              Delete
            </Button>
          )}
          <Button variant={'default'}>
            <Link className="h-full w-full" href={'/dashboard/products/new'}>
              Create
            </Link>
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
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
