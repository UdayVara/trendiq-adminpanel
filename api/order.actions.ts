import axiosInstance from "@/lib/axios";
import { queryOptions } from "@tanstack/react-query";


export const fetchOrders = async() => {
    try {
        const res = await axiosInstance.get('admin/order/');
        if(res.data?.statusCode == 200){
            return {
                data:res.data?.data || [],
                message:'Orders Fetched Successfully',
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

export const fetchOrderById = async(id:string) => {
    try {
        const res = await axiosInstance.get(`admin/order/${id}`);
        if(res.data?.statusCode == 200){
            return {
                data:res.data?.data || [],
                message:'Order Fetched Successfully',
                success:true,
                orderUpdateHistory:res.data?.orderUpdateHistory || []
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

export const updateOrderStatusService = async(id:string,status:string) => {
    try {
        const res = await axiosInstance.put(`admin/order/update-status`,{status,orderId:id});
        if(res.data?.statusCode == 200){
            return {
                success:true,
                message:'Order Status Updated Successfully'
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
            message:'Internal Server Error',
            data:[]
        }
    }
}
export const OrderQuery = queryOptions({
  queryKey: ['orders'],
  queryFn: fetchOrders
});


