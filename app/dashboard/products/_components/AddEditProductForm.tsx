'use client';
import { fetchCategories } from '@/api/categories.actions';
import { addProductAction, updateProductAction } from '@/api/products.actions';
import { fetchSizesByCategory } from '@/api/size.actions';
import { Button } from '@/components/ui/button';
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem
} from '@/components/ui/file-uploader';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Category, gender, Product, Size } from '@/constants/data';
import { ColorModule } from '@faker-js/faker';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { CloudUpload, Paperclip } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import Component from './WYSWIGEditor';
import WYSWIGEditor from './WYSWIGEditor';

const initialValues = {
  categoryId: '',
  sizeId: '',
  file: [],
  markupDescription:"",
  description: '',
  title: '',
  price: '',
  discount: '',
  stock: '',
  minimum_stock: '',
  color: ''
};
function AddEditProductForm({
  isEdit,
  product,
  isVariant = false
}: {
  isEdit: boolean;
  product?: Product;
  isVariant?: boolean;
}) {
  const router = useRouter();
  const formSchema = z.object({
    title: isVariant ? z.string().optional() : z
      .string({ required_error: 'Title is Required' })
      .min(1, { message: 'Title is Required' }),
    description: z
      .string({ required_error: 'Description is Required' })
      .min(1, { message: 'Description is Required' }),
    markupDescription: z
      .string({ required_error: 'Description is Required' }).optional(),
      
    categoryId: z
      .string({ required_error: 'Category is Required' })
      .min(1, { message: 'Category is Required' }),
    sizeId: isEdit
      ? z.string().optional()
      : z
          .string({ required_error: 'Size is Required' })
          .min(1, { message: 'Size is Required' }),
    price:
      isEdit && !isVariant
        ? z.string().optional()
        : z
            .string({ required_error: 'Price is Required' })
            .min(1, { message: 'Price is Required' }),
    discount:
      isEdit && !isVariant
        ? z.string().optional()
        : z
            .string({ required_error: 'Discount is Required' })
            .min(1, { message: 'Discount is Required' }),
    color: z
      .string({ required_error: 'Color is Required' })
      .min(1, { message: 'Color is Required' }),
    stock:
      isEdit && !isVariant
        ? z.string().optional()
        : z
            .string({ required_error: 'Stock is Required' })
            .min(1, { message: 'Stock is Required' }),
    minimum_stock:
      isEdit && !isVariant
        ? z.string().optional()
        : z
            .string({ required_error: 'Minimum Stock is Required' })
            .min(1, { message: 'Minimum Stock is Required' }),
    file: isEdit && !isVariant
      ? z.array(z.instanceof(File)).optional()
      : z.array(z.instanceof(File)).nonempty('Please at least one item'),
    gender: z.enum(['male', 'female', 'unisex']).default('unisex'),
    isTrending: z.boolean().default(false)
  });
  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          categoryId: product?.category.id || '',
          file: [],
          description: product?.description || '',
          markupDescription: product?.markupDescription || '',
          title: product?.title || '',
          discount: '',
          price: '',
          stock: '',
          minimum_stock: '',
          gender: product?.gender || 'unisex',
          isTrending: isVariant ? false : product?.isTrending,
          color: isVariant ? '' : product?.color || ''
        }
      : isVariant ? {...initialValues, title: product?.title,categoryId: product?.category.id || '',gender: product?.gender || 'unisex',} : initialValues
  });

  const [sizes, setSizes] = useState<Size[]>([]);
  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const getSizeByCategory = async () => {
    try {
      const res = await fetchSizesByCategory(form.watch('categoryId'));

      setSizes(res.data || []);
    } catch (error) {
      setSizes([]);
      console.log(error);
    }
  };

  async function onSubmit(values:any) {
    try {
      if (!isEdit) {
        const res = await addProductAction(isVariant ? {...values, title: product?.title,categoryId: product?.category.id || '',gender: product?.gender || 'unisex'} : values, files || []);

        if (res.success) {
          toast.success(res.message);
          router.replace("/dashboard/products");
          form.reset(initialValues);
          setFiles([]);
        } else {
          toast.error(res.message);
        }
      } else {
        const res = await updateProductAction(
          values,
          files || [],
          product?.id || ''
        );
        if (res.success) {
          toast.success(res.message);
          router.replace("/dashboard/products");
          form.reset(initialValues);
          setFiles([]);
        } else {
          toast.error(res.message);
        }
      }
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
      toast.error('Failed to submit the form. Please try again.');
    }
  }
  console.log("Product",product)

  useEffect(() => {
    if (form.watch('categoryId') != null) {
      console.log('API CALLED FOR SIZE');
      getSizeByCategory();
    }
  }, [form.watch('categoryId')]);
  return (
    <div className=" w-full h-max overflow-y-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto  grid grid-cols-12 gap-4 pb-4"
        >
          <div className="col-span-4 rounded border-2 p-4">
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
                      dropzoneOptions={dropZoneConfig}
                      className="relative rounded-lg bg-background p-2"
                    >
                      <FileInput
                        id="fileInput"
                        className="outline-dashed outline-1 outline-slate-500"
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

            {isEdit && product?.imageUrl != '' && !isVariant && (
              <div className="mt-5">
                <h3>Preview</h3>
                <Image
                  src={product?.imageUrl || ''}
                  className="h-40 w-40 object-cover object-center"
                  width={1000}
                  height={1000}
                  alt="Failed to Load"
                />
              </div>
            )}
          </div>
          <div className="col-span-8 rounded border-2 pb-4">
            <h4 className="font-regular p-4 pb-2">General Information</h4>
            <Separator />
            <div className="space-y-3 px-3 pt-2">
              <FormField
                control={form.control}
                name="title"
                disabled={isVariant}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of Product" type="" {...field} />
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
                      <Textarea
                        placeholder="Description of Product"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <WYSWIGEditor text={form.watch("markupDescription") || ""} onChange={(val:any)=>{form.setValue("markupDescription",val)}}/>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
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
                </div>
                <div className="col-span-5">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Color of Product"
                            type=""
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="isTrending"
                    render={({ field }) => (
                      <FormItem className="flex h-full flex-row items-end  gap-3 pb-3 ">
                        <div className="space-y-0.5">
                          <FormLabel>Trending :</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select A Category for the Product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {data?.data?.map((category: Category) => (
                              <SelectItem value={category.id} key={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-6">
                  <FormField
                    disabled={isEdit}
                    control={form.control}
                    name="sizeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={`${
                                  isEdit
                                    ? 'Edit Inventory details from Inventory Section'
                                    : 'Select a Size of Product Based on Category'
                                }`}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sizes?.map((size: Size) => (
                              <SelectItem key={size.id} value={size.id}>
                                {size.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="price"
                    disabled={isEdit && !isVariant}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Price of Product"
                            type="number"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="discount"
                    disabled={isEdit && !isVariant}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discout</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Discount %"
                            type="number"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="stock"
                    disabled={isEdit && !isVariant}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Available Stock"
                            type="number"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="minimum_stock"
                    disabled={isEdit && !isVariant}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Stock</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Minimum Stock for The Product"
                            type="number"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="">
                Submit
              </Button>
              <Button
                onClick={() => {
                  form.reset(initialValues);
                }}
                className="ml-4"
                variant={'secondary'}
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AddEditProductForm;
