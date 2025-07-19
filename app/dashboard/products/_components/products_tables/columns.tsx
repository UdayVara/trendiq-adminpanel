'use client';
import { updateStatus } from '@/api/products.actions';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Product } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import AddEditVariant from '../AddEditVariant';
import ListVariants from '../ListVariants';

export const columns: ColumnDef<Product>[] = [
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
    header: 'ID',
    cell({ row }) {
      return (
        <>
          <Image
            src={row.original.imageUrl || ''}
            alt=""
            width={1000}
            height={1000}
            className="h-14 w-14 object-contain  rounded"
          />
        </>
      );
    }
  },
  {
    accessorKey: 'title',
    header: 'Name'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    filterFn: 'equals',
    cell: ({ row }) => {
      return (
        <>
          <span className="capitalize">{row.original.gender}</span>
        </>
      );
    }
  },
{
  id: 'category', // use this for filtering and referencing
  header: 'Category',
  accessorFn: (row) => row.category?.name || '', // safe access
  cell: ({ row }) => row.original.category?.name || '',
  filterFn: 'equals',
}
,
  {
    accessorKey: 'size.name',
    header: 'Size'
  },
  {
    accessorKey: 'price',
    header: 'Price',
    filterFn: 'inNumberRange',
    cell({ row }) {
      console.log(row.original)
      return (
        <>
          <div className="5 flex flex-col gap-0">
            <span className="text-xs text-neutral-700 dark:text-neutral-400">
              {' '}
              MRP : {row.original?.product_inventory[0]?.price}
            </span>
            <span className="text-xs text-neutral-700 dark:text-neutral-400">
              {' '}
              Discount : {row.original?.product_inventory[0].price * (row.original?.product_inventory[0].discount / 100)} (
              {row.original?.product_inventory[0].discount} %)
            </span>
            <span className="font-medium text-green-500">
              {' '}
              Final Price : ₹{' '}
              {row.original?.product_inventory[0].price -
                row.original?.product_inventory[0].price * (row.original?.product_inventory[0].discount / 100)}{' '}
            </span>
          </div>
        </>
      );
    }
  },
  {
    accessorKey: 'isTrending',
    header: 'Trending',
    cell: ({ row }:any) => {
      return (
        <Switch
          defaultChecked={row.original.isTrending}
          onCheckedChange={async (value) => {
            const res = await updateStatus(row.original.productId, value);

            if (res.success) {
              toast.success(res.message);
            } else {
              toast.error(res.message);
            }
          }}
        />
      );
    }
  },
  {
    header: 'Action',
    accessorKey: 'action',
    cell({ row, table }: any) {
      return (<div>
          <Link
            href={`/dashboard/product/` + row.original.id}
            className="font-medium text-blue-500 underline-offset-2 hover:underline"
          >
            View
          </Link>
          <Link
            href={'/dashboard/products/edit/' + row.original.id}
            className="font-medium pl-3 text-blue-500 underline-offset-2 hover:underline"
          >
            Edit
          </Link>
          <Link
            href={'/dashboard/products/add_variant/' + row.original.id}
            className="font-medium pl-3 text-blue-500 underline-offset-2 hover:underline"
          >
            Add Variant
          </Link>
          {/* <ListVariants product={table.options.meta?.originalProducts?.find((product: any) => product.id === row.original.productId) || []} /> */}
            
        </div>
      );
    }
  }
];
