import axiosInstance from '@/lib/axios';
import { queryOptions } from '@tanstack/react-query';

type productFormType ={
  title: string;
  description: string;
  categoryId: string;
  color: string;
  markupDescription?:string;
  gender: "male" | "female" | "unisex";
  isTrending: boolean;
  sizeId?: string | undefined;
  price?: string | undefined;
  discount?: string | undefined;
  stock?: string | undefined;
  minimum_stock?: string | undefined;
  file?: File[] | [File, ...File[]] | undefined;
}
export const addProductAction = async (
  values: productFormType,
  files: File[] | null
) => {
  try {
    const formdata = new FormData();
    formdata.append('title', values.title);
    formdata.append('description', values.description);
    formdata.append('markupDescription', values?.markupDescription || "");
    formdata.append('categoryId', values.categoryId);
    formdata.append('sizeId', values?.sizeId || "");
    formdata.append('price', values?.price || "");
    formdata.append('discount', values?.discount || "");
    formdata.append('stock', values?.stock || "");
    formdata.append('minimumStock', values?.minimum_stock || "");
    formdata.append('gender', values.gender);
    formdata.append('color', values.color);
    formdata.append('isTrending', values.isTrending.toString());

    files?.forEach((file) => {
      formdata.append('file', file);
    });
    const res = await axiosInstance.post('/admin/product', formdata);

    if (res.data?.statusCode == 201) {
      return {
        success: true,
        message: 'Product Created Successfully',
        new: res.data?.newProduct
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
export const updateProductAction = async (
  values: productFormType,
  files: File[] | null,
  id: string
) => {
  try {
    const formdata = new FormData();
    formdata.append('productId', id);
    formdata.append('title', values.title);
    formdata.append('description', values.description);
    formdata.append('markupDescription', values?.markupDescription || "");
    formdata.append('categoryId', values.categoryId);
    formdata.append('sizeId', values?.sizeId || "");
    formdata.append('price', values?.price || "");
    formdata.append('discount', values?.discount || "");
    formdata.append('stock', values?.stock || "");
    formdata.append('minimumStock', values?.minimum_stock || "");
    formdata.append('gender', values.gender);
    formdata.append('color', values.color);
    formdata.append('isTrending', values.isTrending.toString());

    files?.forEach((file) => {
      formdata.append('file', file);
    });
    const res = await axiosInstance.patch('/admin/product', formdata);

    if (res.data?.statusCode == 201) {
      return {
        success: true,
        message: 'Product Updated Successfully',
        new: res.data?.newProduct
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

export const fetchProducts = async () => {
  try {
    const res = await axiosInstance.get('/admin/product/admin');
    if (res.data?.statusCode == 200) {
      return {
        data: {filtered:res.data?.data || [],original:res.data?.originalData || []},
        message: 'products Fetched Successfully',
        success: true
      };
    } else {
      return {
        success: false,
        data:  {filtered:[],original:[]},
        message: res?.data?.message || 'Internal Server Error'
      };
    }
  } catch (error) {
    console.log('Error Occured :- ', error);
    return { success: false, message: 'Internal Server Error', data:  {filtered:[],original:[]}, };
  }
};

export const updateStatus = async (productId: string, isTrending: boolean) => {
  try {
    const res = await axiosInstance.patch('/admin/product/status', {
      productId,
      isTrending
    });
    if (res.data?.statusCode == 201) {
      return {
        success: true,
        message: res.data?.message || 'Product Status Updated Successfully'
      };
    }
    return {
      statusCode: 201,
      message: res.data.message
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Internal Server Error'
    };
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const res = await axiosInstance.get('/admin/product/' + id);

    if (res.data?.statusCode == 200) {
      return {
        data: res.data.data,
        message: 'Product Fetched Successfully',
        success: true
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Internal Server Error'
    };
  }
};

export const deleteProducts = async (id: string[]) => {
  try {
    console.log(id)
    const res = await axiosInstance.delete('/admin/product' + '/' + id.join(','));
    if (res.data?.statusCode == 200) {
      return { success: true, message: 'Product Deleted Successfully' };
    } else {
      return {
        success: false,
        message: res?.data?.message || 'Internal Server Error'
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Internal server Error'
    };
  }
};

export const fetchInventorybyId = async (id: string) => {
  try {
    const res = await axiosInstance.get('/admin/product/inventory/' + id);

    if (res.data.statusCode == 200) {
      return {
        success: true,
        message: 'Inventory Fetched Successfully',
        data: res.data.data
      };
    } else {
      return {
        success: false,
        message: res?.data?.message || 'Internal Server Error',data:[]
      };
    }
  } catch (error) {
    return { success: false, message: 'Internal Server Error' ,data:[]};
  }
};

export const addInventory = async (addPayload:{
  productId: string;
  stock: number;
  minimum_stock: number;
  discout:number;
  price:number;
  sizeId:string;
}) => {
  console.log("paylod",addPayload)
  try {
    const res = await axiosInstance.post(`/admin/product/inventory/${addPayload.productId}`,{...addPayload});
    if (res.data?.statusCode == 201) {
      return { success: true, message: 'Inventory Added Successfully' };
    } else {
      return {
        success: false,
        message: res?.data?.message || 'Internal Server Error'
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Internal server Error'
    };
  }
}
export const editInventory = async (editPayload:{
  productId: string;
  stock: number;
  minimum_stock: number;
  discout:number;
  price:number;
  sizeId:string;
  inventoryId:string
}) => {
  try {
    const res = await axiosInstance.put(`/admin/product/inventory/${editPayload.productId}`,{...editPayload});
    if (res.data?.statusCode == 201) {
      return { success: true, message: 'Inventory Added Successfully' };
    } else {
      return {
        success: false,
        message: res?.data?.message || 'Internal Server Error'
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Internal server Error'
    };
  }
}
export const productsQuery = queryOptions({
  queryKey: ['products'],
  queryFn: fetchProducts
});


export const productInventoryQuery = (id: string) =>
  queryOptions({
    queryKey: [`product--inventory${id}`],
    queryFn: () => fetchInventorybyId(id)
  });
export const individualProductsQuery = (id: string) =>
  queryOptions({
    queryKey: ['products-' + id],
    queryFn: fetchProducts
  });
