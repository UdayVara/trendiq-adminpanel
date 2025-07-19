'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Category, Size } from '@/constants/data';
import {
  createCategory,
  fetchCategories,
  updateCategory
} from '@/api/categories.actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { createSize, updateSize } from '@/api/size.actions';

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string()
});

function AddEditSizeDialog({
  isEdit,
  size,
  onComplete
}: {
  isEdit: boolean;
  size?: Size | null;
  onComplete?: () => any;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: isEdit ? size?.name || '' : '',
      description: isEdit ? size?.description || '' : '',
      category: isEdit ? size?.category?.id || '' : ''
    }
  });
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isEdit) {
        const res = await updateSize({
          ...values,
          sizeId: size?.id || ''
        });

        if (res.success) {
          toast.success(res.message || 'Size Updated Successfully');
          queryClient.invalidateQueries({
            queryKey: ['sizes']
          });
          onComplete && onComplete();
          form.reset();
        } else {
          toast.error(res.message || 'Internal Server Error');
        }
      } else {
        const res = await createSize(values);

        if (res.success) {
          toast.success(res.message || 'Size Created Successfully');
          queryClient.invalidateQueries({
            queryKey: ['sizes']
          });
          form.reset();
        } else {
          toast.error(res.message || 'Internal Server Error');
        }
      }
    } catch (error: any) {
      toast.error(
        error?.message || 'Failed to submit the form. Please try again.'
      );
    }
    setOpen(false);
  }
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className={` shadow  ${
            isEdit ? 'text-blue-500 bg-transparent ' : 'h-9 hover:bg-primary/90 bg-primary text-primary-foreground rounded px-3 ml-3 '
          }`}
        >
          {isEdit ? 'Edit' : 'Add '} Size
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Size</DialogTitle>
            <DialogDescription>
              This Will New Size to The Trendiq Enviroment
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto w-full space-y-8 py-10"
            >
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data?.data?.map((item: Category) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Size Name" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddEditSizeDialog;
