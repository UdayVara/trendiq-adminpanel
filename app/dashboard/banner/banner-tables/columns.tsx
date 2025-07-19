'use client';
import { deleteBanners } from '@/api/banner.actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Banner, Category, Enviroment } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { toast } from 'sonner';


export const columns: ColumnDef<Banner>[] = [
  {
    accessorKey: 'defaultImage',
    header: 'Default Image',
    cell: ({ row }) => (
      <>
      <Image
        src={row.original?.defaultImage || ''}
        alt={row.original?.defaultImage || ''}
        width={1000}
        height={1000}
        className="h-14 w-14 object-top object-contain  rounded"
        />
        </>
    )
  },
  {
    accessorKey: 'mobileImage',
    header: 'Mobile Image',
    cell: ({ row }) => (
      <>
      <Image
        src={row.original?.mobileImage || ''}
        alt={row.original?.mobileImage || ''}
        width={1000}
        height={1000}
        className="h-14 w-14 object-top object-contain  rounded"
        />
        </>
    )
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
   
  },
 
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => (
     <Button onClick={async()=>{
      const res = await deleteBanners(row?.original.id)

      if(res.success){
        toast.success(res.message)
        table.resetRowSelection();
        table.resetColumnFilters();
        table.resetSorting();
        table.setGlobalFilter('');
        
      }else{
        toast.error(res.message)
      }
     }}>Delete</Button>
    )
  }
];
