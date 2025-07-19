/* eslint-disable react/no-unescaped-entities */
'use client';

import { useForm, Controller, FormSubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { fetchSizesByCategory } from '@/api/size.actions';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Size } from '@/constants/data';
import { addInventory, editInventory } from '@/api/products.actions';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

// Define Zod schema
const formSchema = z.object({
  size: z.string().min(1, 'Size is required'),
  price: z.number().min(0, 'Price must be at least 0'),
  discount: z.number().min(0, 'Discount must be at least 0'),
  stock: z.number().min(0, 'Stock must be at least 0'),
  minimumStock: z.number().min(0, 'Minimum stock must be at least 0')
});

function AddEditVariant({
  categoryId,
  isEdit,
  productId,
  inventory,
  availableSizes
}: {
  categoryId: string;
  productId: string;
  isEdit: boolean;
  inventory?: any;
  availableSizes?: any;
}) {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: !isEdit
      ? {
          size: '',
          price: 0,
          discount: 0,
          stock: 0,
          minimumStock: 0
        }
      : {
          size: inventory?.sizeId,
          price: inventory?.price,
          discount: inventory?.discount,
          stock: inventory?.stock,
          minimumStock: inventory?.minimum_stock
        }
  });

  const getSizeByCategory = async () => {
    try {
      const res = await fetchSizesByCategory(categoryId);
      const tempSize: any = [];
      res?.data?.map((item: any) => {
        

        if(Object.keys(availableSizes?.find((temp: any) => temp?.size.id === item.id) || {})?.length == 0) {
          tempSize.push(item);
        }
        
      });
      setSizes(tempSize || []);
    } catch (error) {
      setSizes([]);
      console.log(error);
    }
  };

  useEffect(() => {
    getSizeByCategory();
  }, [categoryId]);

  const onSubmit = async (data: any) => {
    if (isEdit) {
      const res = await editInventory({
        ...data,
        productId: productId,
        inventoryId: inventory?.id,
        sizeId: data.size
      });
      if (res?.success) {
        toast.success(res?.message);
        queryClient.invalidateQueries({ queryKey: ['products'] });
      } else {
        toast.error(res?.message);
      }
    } else {
      const res = await addInventory({
        ...data,
        sizeId: data.size,
        productId: productId
      });

      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries(['products']);
      } else {
        toast.error(res.message);
      }
    }
    // Add form submission logic here
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild >
        <Button variant="outline"  size={"sm"} className={`text-neutral-300 block ${isEdit ? "mr-auto" : "ml-auto"}`}>
          {isEdit ? 'Update Stock' : 'Add Stock'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Stock</DialogTitle>
          <DialogDescription>
            Fill in the details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">
                Size
              </Label>
              <Controller
                name="size"
                control={control}
                render={({ field }) => (
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id.toString()}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.size && (
                <p className="tet-xs col-span-4 text-right text-red-500">
                  {/* @ts-ignore */}
                  {errors?.size?.message}
                </p>
              )}
            </div>

            {[
              { name: 'price', label: 'Price' },
              { name: 'discount', label: 'Discount' },
              { name: 'stock', label: 'Stock' },
              { name: 'minimumStock', label: 'Minimum Stock' }
            ].map(({ name, label }: any) => (
              <div key={name} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={name} className="text-right">
                  {label}
                </Label>
                <Controller
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id={name}
                      className="col-span-3"
                      type="number"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  )}
                />
                {/* @ts-ignore */}
                {errors[name] && (
                  <p
                    className="col-span-4 my-0 block py-0 text-right text-xs  text-red-500
                  "
                  >
                    {/* @ts-ignore */}
                    {errors[name]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                console.log(getValues());
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddEditVariant;
