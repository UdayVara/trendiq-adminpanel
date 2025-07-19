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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useQueryClient } from '@tanstack/react-query';
import { Category } from '@/constants/data';
import { createCategory, updateCategory } from '@/api/categories.actions';
import { FileUploader } from '@/components/file-uploader';
import { FileInput, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-uploader';
import { CloudUpload, Paperclip } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



function  AddEditCategoryDialog({
  isEdit,
  category,
  onComplete
}: {
  isEdit: boolean;
  category?: Category | null;
  onComplete?: () => any;
}) {
  const formSchema = z.object({
    name: z.string(),
    description: z.string(),
    gender:z.string(),
    file: isEdit 
    ? z.array(z.instanceof(File)).optional()
    : z.array(z.instanceof(File)).nonempty('Please at least one item'),
  });
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: isEdit ? category?.name || '' : '',
      description: isEdit ? category?.description || '' : '',
      gender:isEdit ? category?.gender || '' : '',
    }
  });

  const [files, setFiles] = useState<File[]>([]);
  
    const dropZoneConfig = {
      maxFiles: 1,
      maxSize: 1024 * 1024 * 4,
      multiple: false
    };
  const queryClient = useQueryClient();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isEdit) {
        const res = await updateCategory({
          ...values,
          id: category?.id || ''
        });

        if (res.success) {
          toast.success(res.message || 'Category Updated Successfully');
          queryClient.invalidateQueries({
            queryKey: ['categories']
          });
          onComplete && onComplete();
          form.reset();
        } else {
          toast.error(res.message || 'Internal Server Error');
        }
      } else {
        const res = await createCategory(values);

        if (res.success) {
          toast.success(res.message || 'Categories Created Successfully');
          queryClient.invalidateQueries({
            queryKey: ['categories']
          });
          form.reset();
          setFiles([]);
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
          {isEdit ? 'Edit' : 'Add '} Category
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              This Will New Enviroment Variable to The Trendiq Enviroment
              Variables.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto w-full space-y-4 "
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category Name" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
<FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="unisex">Unisex</SelectItem>
                          </SelectContent>
                        </Select>

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
              <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Select File</FormLabel>
                                <FormControl>
                                  <FileUploader
                                    value={files}
                                    onValueChange={(files) => {
                                      setFiles(files);
                                      field.onChange(files);
                                    }}
                                    // @ts-ignore
                                    dropzoneOptions={dropZoneConfig}
                                    className="relative rounded-lg bg-background p-2"
                                  >
                                    <FileInput
                                      id="fileInput"
                                      className="outline-dashed outline-1 outline-slate-500"
                                    >
                                      <div className="flex w-full flex-col items-center justify-center p-8 ">
                                        <CloudUpload className="h-8 w-10 text-gray-500" />
                                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                          <span className="font-semibold">
                                            Click to upload
                                          </span>
                                          &nbsp; or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          SVG, PNG, JPG or GIF
                                        </p>
                                      </div>
                                    </FileInput>
                                    <FileUploaderContent>
                                      {files &&
                                        files.length > 0 &&
                                        files.map((file, i) => (
                                          <FileUploaderItem key={i} index={i}>
                                            <Paperclip className="h-4 w-4 stroke-current" />
                                            <span>{file.name}</span>
                                          </FileUploaderItem>
                                        ))}
                                    </FileUploaderContent>
                                  </FileUploader>
                                </FormControl>
                                <FormDescription>Select a file to upload.</FormDescription>
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

export default AddEditCategoryDialog;
