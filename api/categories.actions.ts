import axiosInstance from '@/lib/axios';
import { queryOptions } from '@tanstack/react-query';

export const fetchCategories = async () => {
  try {
    const res = await axiosInstance.get('admin/category');
    console.log("Categorye",res)
    if (res.data?.statusCode == 200) {
      return {
        data: res.data?.categories || [],
        message: 'Categories Fetched Successfully',
        success: true
      };
    } else {
      return {
        success: false,
        data: [],
        message: res?.data?.message || 'Internal Server Error'
      };
    }
  } catch (error) {
    console.log('Error Occured :- ', error);
    return { success: false, message: 'Internal Server Error', data: [] };
  }
};

export const createCategory = async (data: {
  name: string;
  description: string;
  gender:string;
  file?: File[];
}) => {
  try {
    if (!data.file?.length) {
      return { success: false, message: 'Please select an image' };
    }
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('gender', data.gender);
    formData.append('file', data.file![0]);
    const res = await axiosInstance.post('admin/category', formData);
    if (res.data?.statusCode == 201) {
      return {
        success: true,
        message: 'Category Created Successfully',
        new: res.data?.newCategory
      };
      
    } else {
      return {
        success: false,
        message: res?.data?.message || 'Internal Server Error'
      };
    }
  } catch (error) {
    console.log('Error Occured :- ', error);
    return { success: false, message: 'Internal Server Error' };
  }
};
export const updateCategory = async (data: {
  name: string;
  description: string;
  id: string;
  gender:string;
  file?: File[];
}) => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('gender', data.gender);
    if (data.file?.length) {
      formData.append('file', data.file![0]);
    }
    formData.append('id', data.id);
    const res = await axiosInstance.patch('admin/category', formData);
    if (res.data?.statusCode == 201) {
      return { success: true, message: 'Category Updated Successfully' };
    } else {
      return {
        success: false,
        message: res?.data?.message || 'Internal Server Error'
      };
    }
  } catch (error) {
    console.log('Error Occured :- ', error);
    return { success: false, message: 'Internal Server Error' };
  }
};
export const deleteCategory = async (data: { id: string }) => {
  try {
    const res = await axiosInstance.delete(`admin/category/${data.id}`);
    if (res.data?.statusCode == 201) {
      return { success: true, message: 'Category Deleted Successfully' };
    } else {
      return {
        success: false,
        message: res?.data?.message || 'Internal Server Error'
      };
    }
  } catch (error) {
    console.log('Error Occured :- ', error);
    return { success: false, message: 'Internal Server Error' };
  }
};

export const categoryQuery = queryOptions({
  queryKey: ['categories'],
  queryFn: fetchCategories
});
