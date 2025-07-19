import axiosInstance from "@/lib/axios";
import { queryOptions } from "@tanstack/react-query";


export const fetchBanners = async() => {
    try {
        const res = await axiosInstance.get('admin/banner');
        if(res.data?.statusCode == 200){
            return {
                data:res.data?.data || [],
                message:'Banners Fetched Successfully',
                success:true
            }
        }else{
            return {
                success:false,
                data:[],
                message:res?.data?.message || 'Internal Server Error'
            }
        }
    } catch (error) {
        return {
            success:false,
            message:'Internal Server Error',
            data:[]
        }
    }
}

export const addBanners = async (value: {
    default: [File, ...File[]];
    mobile: [File, ...File[]];
    gender: string;
  }) => {
    try {
      const formData = new FormData();
  
      // Append files with 'files' key (as per backend update)
      formData.append("files", value.default[0]);
      formData.append("files", value.mobile[0]);
  
      // Append other data
      formData.append("gender", value.gender);
  
      const res = await axiosInstance.post("admin/banner", formData);
  
      if (res?.data?.statusCode === 201) {
        return {
          success: true,
          message: "Banner Added Successfully",
        };
      } else {
        return {
          success: false,
          message: res?.data?.message || "Internal Server Error",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || "Internal Server Error",
      };
    }
  };

export const deleteBanners = async (id:string) => {
    try {
        const res = await axiosInstance.delete(`admin/banner/${id}`);
        if(res.data?.statusCode == 201){
            return {
                success:true,
                message:'Banner Deleted Successfully'
            }
        }else{
            return {
                success:false,
                message:res?.data?.message || 'Internal Server Error'
            }
        }
    } catch (error) {
        return {
            success:false,
            message:'Internal Server Error'
        }
    }
}
export const bannerQuery = queryOptions({
  queryKey: ['categories'],
  queryFn: fetchBanners
});