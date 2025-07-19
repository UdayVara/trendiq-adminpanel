/* eslint-disable react/no-unescaped-entities */
'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { productVariant } from '@/constants/data';
import React from 'react';
import AddEditVariant from './AddEditVariant';

function ListVariants({ product }: { product: any }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className='font-medium hover:text-blue-500 text-blue-500 underline-offset-2 hover:underline hover:bg-transparent'>Manage Inventory </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <div className='flex flex-row items-center justify-between'>
                <div>

              <DialogTitle>
                Manage Inventory ( {product?.title} {product?.color} )
              </DialogTitle>
              <DialogDescription>
                Fill in the details below. Click save when you're done.
              </DialogDescription>
                </div>
                <AddEditVariant productId={product.id} categoryId={product.category.id} isEdit={false} />
            </div>
          </DialogHeader>
          <Table>
            <TableCaption>A list of Inventory</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.product_inventory.map((variant: productVariant) => (
                <TableRow key={variant.id} className="text-left">
                  <TableCell className="font-medium">
                    {variant?.size?.name}
                  </TableCell>
                  <TableCell>{variant.price}</TableCell>
                  <TableCell>{variant.discount}</TableCell>
                  <TableCell className="text-left">{variant.stock}</TableCell>
                  <TableCell className="text-right">
                    <AddEditVariant availableSizes={product?.product_inventory} productId={product.id} categoryId={product.category.id} inventory={variant} isEdit />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ListVariants;
