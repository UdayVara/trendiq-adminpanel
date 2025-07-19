
import axiosInstance from "@/lib/axios";
import { queryOptions } from "@tanstack/react-query";

export const fetchSizes = async () => {
  try {
    const res = await axiosInstance.get("admin/size");

    if (res.data?.statusCode == 200) {
      return {
        data: res.data?.sizes || [],
        message: "Size Fetched Successfully",
        success: true,
      };
    } else {
      return {
        success: false,
        message: res?.data?.message || "Internal Server Error",
      };
    }
  } catch (error) {
    console.log("Error Occured :- ", error);
    return { success: false, message:"Internal Server Error" };
  }
};
export const fetchSizesByCategory = async (id:string) => {
  try {
    const res = await axiosInstance.get(`admin/size/${id}`);

    if (res.data?.statusCode == 200) {
      return {
        data: res.data?.sizes || [],
        message: "Sizes Fetched Successfully",
        success: true,
      };
    } else {
      return {
        success: false,
        message: res?.data?.message || "Internal Server Error",data:[]
      };
    }
  } catch (error) {
    return { success: false, message:"Internal Server Error",data:[] };
  }
};

export const createSize = async (data: {
  name:string,
  description:string,
  category:string,
}) => {
  try {
    const res = await axiosInstance.post("admin/size", data);
    if (res.data?.statusCode == 201) {
        return {success:true,message:"Size Created Successfully",new:res.data?.newSize}
    }else{
        return {success:false,message:res?.data?.message || "Internal Server Error"}
    }
  } catch (error) {
    console.log("Error Occured :- ",error)
    return {success:false,message:"Internal Server Error"}
  }
};
export const updateSize = async (data: {
  name:string,
  description:string,
  sizeId:string,
  category:string,
}) => {
  try {
    const res = await axiosInstance.patch("admin/size", data);
    if (res.data?.statusCode == 201) {
        return {success:true,message:"Size Updated Successfully"}
    }else{
        return {success:false,message:res?.data?.message || "Internal Server Error"}
    }
  } catch (error) {
    console.log("Error Occured :- ",error)
    return {success:false,message:"Internal Server Error"}
  }
};
export const deleteSize= async (data: {
  id:string;
}) => {
  try {
    const res = await axiosInstance.delete(`admin/size/${data.id}`);
    if (res.data?.statusCode == 201) {
        return {success:true,message:"Size Deleted Successfully"}
    }else{
        return {success:false,message:res?.data?.message || "Internal Server Error"}
    }
  } catch (error) {
    console.log("Error Occured :- ",error)
    return {success:false,message:"Internal Server Error"}
  }
};


export const sizeQuery = queryOptions({
  queryKey: ["sizes"],
    queryFn: fetchSizes,
})