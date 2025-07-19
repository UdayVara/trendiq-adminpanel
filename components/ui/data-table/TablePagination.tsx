import React from 'react';
import { Button } from '../button';
import { Table } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

function TablePagination({ table }: { table: Table<any> }) {
  // Destructure pagination state
  const { pageIndex, pageSize } = table.getState().pagination;

  // Calculate the start and end item indices for the current page
  const totalRows = table.getFilteredRowModel().rows.length; // Use filtered rows for accurate count
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min(startRow + pageSize - 1, totalRows);

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="ml-3 text-sm">
        Showing {startRow}-{endRow} of {totalRows}
      </div>
      <Select value={table.getState().pagination.pageSize.toString()} onValueChange={(value) => table.setPageSize(Number(value))}>
        <SelectTrigger className="w-max">
          <SelectValue  />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Page Size</SelectLabel>
            {[10, 20, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>{pageSize}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default TablePagination;
