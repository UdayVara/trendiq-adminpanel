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
import { createEnviroment, updateEnviroment } from '@/api/enviroment.actions';
import { useQueryClient } from '@tanstack/react-query';
import { Enviroment } from '@/constants/data';

const formSchema = z.object({
  key: z.string(),
  value: z.string()
});

function AddEditEnviromentDialog({
  isEdit,
  enviroment,
  onComplete
}: {
  isEdit: boolean;
  enviroment?: Enviroment | null;
  onComplete?:() => any
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{
      key:isEdit ? enviroment?.key || '' : '',
      value:isEdit ? enviroment?.value || '' : '',
    }
  });
  const queryClient = useQueryClient();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isEdit) {
        const res = await updateEnviroment({...values,id:enviroment?.id || ''});

        if (res.success) {
          toast.success(res.message || 'Enviroment Updated Successfully');
          queryClient.invalidateQueries({
            queryKey: ['enviroments']
          });
          onComplete && onComplete();
          form.reset();
        } else {
          toast.error(res.message || 'Internal Server Error');
        }
      } else {
        const res = await createEnviroment(values);

        if (res.success) {
          toast.success(res.message || 'Enviroment Created Successfully');
          queryClient.invalidateQueries({
            queryKey: ['enviroments']
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
          className={`shadow  ${
            isEdit ? 'text-blue-500 bg-transparent ' : 'h-9 hover:bg-primary/90 bg-primary text-primary-foreground rounded px-3 ml-3 '
          }`}
        >
          {isEdit ? 'Edit' : 'Add New Enviroment'}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Enviroment</DialogTitle>
            <DialogDescription>
              This Will New Enviroment Variable to The Trendiq Enviroment
              Variables.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto w-full space-y-8 py-10"
            >
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key</FormLabel>
                    <FormControl>
                      <Input placeholder="Key Name" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input placeholder="value" type="" {...field} />
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

export default AddEditEnviromentDialog;
