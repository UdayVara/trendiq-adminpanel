import axiosInstance from "@/lib/axios";
import { queryOptions } from "@tanstack/react-query";


export const fetchEnviroments = async () => {
  try {
    const res = await axiosInstance.get("/enviroment");

    if (res.data?.statusCode == 200) {
      return {
        data: res.data?.data || [],
        message: "Enviroments Fetched Successfully",
        success: true,
      };
    } else {
      return {
        success: false,
        message: res?.data?.message || "Internal Server Error",data:[]
      };
    }
  } catch (error) {
    console.log("Error Occured :- ", error);
    return { success: false, message:"Internal Server Error",data:[] };
  }
};

export const createEnviroment = async (data: {
  key: string;
  value: string;
}) => {
  try {
    const res = await axiosInstance.post("/enviroment", data);
    if (res.data?.statusCode == 201) {
        return {success:true,message:"Enviroment Created Successfully"}
    }else{
        return {success:false,message:res?.data?.message || "Internal Server Error"}
    }
  } catch (error) {
    console.log("Error Occured :- ",error)
    return {success:false,message:"Internal Server Error"}
  }
};
export const updateEnviroment = async (data: {
  key: string;
  value: string;
  id:string;
}) => {
  try {
    const res = await axiosInstance.patch("/enviroment", data);
    if (res.data?.statusCode == 201) {
        return {success:true,message:"Enviroment Updated Successfully"}
    }else{
        return {success:false,message:res?.data?.message || "Internal Server Error"}
    }
  } catch (error) {
    console.log("Error Occured :- ",error)
    return {success:false,message:"Internal Server Error"}
  }
};
export const deleteEnviroment = async (data: {
  id:string[];
}) => {
  try {
    const res = await axiosInstance.delete(`/enviroment/${data.id.join(",")}`,);
    if (res.data?.statusCode == 201) {
        return {success:true,message:"Enviroment Deleted Successfully"}
    }else{
        return {success:false,message:res?.data?.message || "Internal Server Error"}
    }
  } catch (error) {
    console.log("Error Occured :- ",error)
    return {success:false,message:"Internal Server Error"}
  }
};



export const enviromentQuery = queryOptions({
  queryKey: ["enviroments"],
    queryFn: fetchEnviroments,
})