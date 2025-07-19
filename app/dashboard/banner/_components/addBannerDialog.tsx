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
import { addBanners } from '@/api/banner.actions';



function  AddBannerDialog() {
  const formSchema = z.object({
    default:  z.array(z.instanceof(File)).nonempty('Please at least one item'),
    mobile:  z.array(z.instanceof(File)).nonempty('Please at least one item'),
    gender:  z.string(),
  });
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [files, setFiles] = useState<File[]>([]);
  const [mobileFiles, setMobileFiles] = useState<File[]>([]);
  
    const dropZoneConfig = {
      maxFiles: 1,
      maxSize: 1024 * 1024 * 4,
      multiple: false
    };
    const dropZoneConfig1 = {
      maxFiles: 1,
      maxSize: 1024 * 1024 * 4,
      multiple: false
    };
  const queryClient = useQueryClient();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
     
        const res = await addBanners(values);

        if (res.success) {
          toast.success(res.message || 'Categories Created Successfully');
          queryClient.refetchQueries({
            queryKey: ['banner']
          });
          form.reset();
          setFiles([]);
          setMobileFiles([]);
        } else {
          toast.error(res.message || 'Internal Server Error');
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
          className={`shadow  
             'h-9 hover:bg-primary/90 py-1 bg-primary text-primary-foreground rounded px-3 ml-3 '
          `}
        >
          Add Banner
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Banner</DialogTitle>
            <DialogDescription>
              This Will New Banner to The Trendiq Enviroment
              Variables.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto w-full space-y-8 py-2"
            >
             
              <FormField
                            control={form.control}
                            name="default"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Select Default Image Banner File</FormLabel>
                                <FormControl>
                                  <FileUploader
                                    value={files}
                                    onValueChange={(files) => {
                                      setFiles(files);
                                      field.onChange(files);
                                    }}
                                    // @ts-ignore
                                    dropzoneOptions={dropZoneConfig}
                                    className="relative rounded-lg h-20 bg-background p-2"
                                  >
                                    <FileInput
                                      id="fileInput"
                                      className="outline-dashed outline-1 h-20 outline-slate-500"
                                    >
                                      <div className="flex w-full flex-col items-center justify-center p-8 ">
                                        <CloudUpload className="h-10 w-10 text-gray-500" />
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
              <FormField
                            control={form.control}
                            name="mobile"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Select Mobile Image Banner File</FormLabel>
                                <FormControl>
                                  <FileUploader
                                    value={mobileFiles}
                                    onValueChange={(files) => {
                                      setMobileFiles(files);
                                      field.onChange(files);
                                    }}
                                    // @ts-ignore
                                    dropzoneOptions={dropZoneConfig1}
                                    className="relative rounded-lg h-20 bg-background p-2"
                                  >
                                    <FileInput
                                      id="fileInput"
                                      className="outline-dashed outline-1 h-20 outline-slate-500"
                                    >
                                      <div className="flex w-full flex-col items-center justify-center p-8 ">
                                        <CloudUpload className="h-10 w-10 text-gray-500" />
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
                                      {mobileFiles &&
                                        mobileFiles.length > 0 &&
                                        mobileFiles.map((file, i) => (
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
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddBannerDialog;
