import axiosInstance from "@/lib/axios";
import { queryOptions } from "@tanstack/react-query";


export const fetchTransactions = async() => {
    try {
        const res = await axiosInstance.get('admin/order/transactions');
        if(res.data?.statusCode == 200){
            return {
                data:res.data?.data || [],
                message:'Transactions Fetched Successfully',
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


export const transactionQuery = queryOptions({
  queryKey: ['transaction'],
  queryFn: fetchTransactions
});